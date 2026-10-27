using System.Text.Json;

namespace ImpulseSupportTool_Repo.Access;

public sealed class ApprovalLog
{
    private readonly string _path;
    private readonly SemaphoreSlim _gate = new(1, 1);

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public ApprovalLog(string path)
    {
        _path = path;
    }

    public async Task AppendAsync(ApprovalRequestRecord record, CancellationToken cancellationToken)
    {
        await _gate.WaitAsync(cancellationToken);
        try
        {
            var directory = Path.GetDirectoryName(_path);
            if (!string.IsNullOrEmpty(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var line = JsonSerializer.Serialize(record, JsonOptions) + Environment.NewLine;
            await File.AppendAllTextAsync(_path, line, cancellationToken);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<IReadOnlyList<ApprovalRequestRecord>> ListLatestAsync(CancellationToken cancellationToken)
    {
        var lines = await ReadLinesAsync(cancellationToken);
        var latest = new Dictionary<string, ApprovalRequestRecord>(StringComparer.OrdinalIgnoreCase);
        foreach (var record in lines)
        {
            if (!string.IsNullOrWhiteSpace(record.Email))
            {
                latest[record.Email] = record;
            }
        }

        return latest.Values
            .OrderByDescending(record => record.RequestedAt)
            .ToList();
    }

    public async Task<ApprovalRequestRecord?> LatestByEmailAsync(string email, CancellationToken cancellationToken)
    {
        var latest = await ListLatestAsync(cancellationToken);
        return latest.FirstOrDefault(record =>
            string.Equals(record.Email, email, StringComparison.OrdinalIgnoreCase));
    }

    public async Task<ApprovalRequestRecord?> LatestByIdAsync(string id, CancellationToken cancellationToken)
    {
        var latest = await ListLatestAsync(cancellationToken);
        return latest.FirstOrDefault(record =>
            string.Equals(record.Id, id, StringComparison.Ordinal));
    }

    private async Task<List<ApprovalRequestRecord>> ReadLinesAsync(CancellationToken cancellationToken)
    {
        await _gate.WaitAsync(cancellationToken);
        try
        {
            if (!File.Exists(_path))
            {
                return [];
            }

            var lines = await File.ReadAllLinesAsync(_path, cancellationToken);
            var records = new List<ApprovalRequestRecord>();
            foreach (var line in lines)
            {
                if (string.IsNullOrWhiteSpace(line))
                {
                    continue;
                }

                try
                {
                    var record = JsonSerializer.Deserialize<ApprovalRequestRecord>(line, JsonOptions);
                    if (record is not null)
                    {
                        records.Add(record);
                    }
                }
                catch (JsonException)
                {
                    continue;
                }
            }

            return records;
        }
        finally
        {
            _gate.Release();
        }
    }
}
