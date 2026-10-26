using System.Text.Json;

namespace ImpulseSupportTool_Repo.Access;

public sealed class UserAccessLog
{
    private readonly string _path;
    private readonly SemaphoreSlim _gate = new(1, 1);

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public UserAccessLog(string path)
    {
        _path = path;
    }

    public string Path => _path;

    public async Task AppendAsync(UserAccessRecord record, CancellationToken cancellationToken)
    {
        await _gate.WaitAsync(cancellationToken);
        try
        {
            var directory = System.IO.Path.GetDirectoryName(_path);
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

    public async Task<UserAccessRecord?> LatestAsync(string email, CancellationToken cancellationToken)
    {
        await _gate.WaitAsync(cancellationToken);
        try
        {
            if (!File.Exists(_path))
            {
                return null;
            }

            var lines = await File.ReadAllLinesAsync(_path, cancellationToken);
            UserAccessRecord? latest = null;
            foreach (var line in lines)
            {
                if (string.IsNullOrWhiteSpace(line))
                {
                    continue;
                }

                UserAccessRecord? record;
                try
                {
                    record = JsonSerializer.Deserialize<UserAccessRecord>(line, JsonOptions);
                }
                catch (JsonException)
                {
                    continue;
                }

                if (record is not null &&
                    string.Equals(record.Email, email, StringComparison.OrdinalIgnoreCase))
                {
                    latest = record;
                }
            }

            return latest;
        }
        finally
        {
            _gate.Release();
        }
    }
}
