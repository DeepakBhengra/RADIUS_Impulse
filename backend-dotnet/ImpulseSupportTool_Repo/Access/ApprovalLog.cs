using Microsoft.Data.Sqlite;

namespace ImpulseSupportTool_Repo.Access;

public sealed class ApprovalLog
{
    private readonly string _path;
    private readonly SemaphoreSlim _gate = new(1, 1);
    private bool _ready;

    public ApprovalLog(string path)
    {
        _path = path;
    }

    public async Task AppendAsync(ApprovalRequestRecord record, CancellationToken cancellationToken)
    {
        await using var connection = await ConnectAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO approval_requests (
                id, email, name, country, role, status, note, temporary_password,
                requested_at, approved_at, declined_at)
            VALUES (
                $id, $email, $name, $country, $role, $status, $note, $temporaryPassword,
                $requestedAt, $approvedAt, $declinedAt)
            ON CONFLICT(id) DO UPDATE SET
                email = excluded.email,
                name = excluded.name,
                country = excluded.country,
                role = excluded.role,
                status = excluded.status,
                note = excluded.note,
                temporary_password = excluded.temporary_password,
                requested_at = excluded.requested_at,
                approved_at = excluded.approved_at,
                declined_at = excluded.declined_at;
            """;
        Bind(command, record);
        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<ApprovalRequestRecord>> ListLatestAsync(CancellationToken cancellationToken)
    {
        await using var connection = await ConnectAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, email, name, country, role, status, note, temporary_password,
                   requested_at, approved_at, declined_at
            FROM approval_requests AS request
            WHERE requested_at = (
                SELECT MAX(latest.requested_at)
                FROM approval_requests AS latest
                WHERE latest.email = request.email)
            ORDER BY requested_at DESC;
            """;
        return await ReadAllAsync(command, cancellationToken);
    }

    public async Task<ApprovalRequestRecord?> LatestByEmailAsync(string email, CancellationToken cancellationToken)
    {
        await using var connection = await ConnectAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, email, name, country, role, status, note, temporary_password,
                   requested_at, approved_at, declined_at
            FROM approval_requests
            WHERE email = $email
            ORDER BY requested_at DESC
            LIMIT 1;
            """;
        command.Parameters.AddWithValue("$email", email.Trim().ToLowerInvariant());
        var rows = await ReadAllAsync(command, cancellationToken);
        return rows.FirstOrDefault();
    }

    public async Task<ApprovalRequestRecord?> LatestByIdAsync(string id, CancellationToken cancellationToken)
    {
        await using var connection = await ConnectAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, email, name, country, role, status, note, temporary_password,
                   requested_at, approved_at, declined_at
            FROM approval_requests
            WHERE id = $id
            LIMIT 1;
            """;
        command.Parameters.AddWithValue("$id", id);
        var rows = await ReadAllAsync(command, cancellationToken);
        return rows.FirstOrDefault();
    }

    private async Task<SqliteConnection> ConnectAsync(CancellationToken cancellationToken)
    {
        await _gate.WaitAsync(cancellationToken);
        try
        {
            var connection = await SqliteSession.OpenAsync(_path, cancellationToken);
            if (!_ready)
            {
                await using var command = connection.CreateCommand();
                command.CommandText = """
                    CREATE TABLE IF NOT EXISTS approval_requests (
                        id TEXT PRIMARY KEY,
                        email TEXT NOT NULL COLLATE NOCASE,
                        name TEXT NOT NULL,
                        country TEXT NOT NULL,
                        role TEXT NOT NULL,
                        status TEXT NOT NULL,
                        note TEXT NOT NULL,
                        temporary_password TEXT NOT NULL,
                        requested_at TEXT NOT NULL,
                        approved_at TEXT,
                        declined_at TEXT
                    );
                    CREATE INDEX IF NOT EXISTS idx_approval_email ON approval_requests(email);
                    """;
                await command.ExecuteNonQueryAsync(cancellationToken);
                _ready = true;
            }

            return connection;
        }
        finally
        {
            _gate.Release();
        }
    }

    private static void Bind(SqliteCommand command, ApprovalRequestRecord record)
    {
        command.Parameters.AddWithValue("$id", record.Id);
        command.Parameters.AddWithValue("$email", record.Email.Trim().ToLowerInvariant());
        command.Parameters.AddWithValue("$name", record.Name ?? "");
        command.Parameters.AddWithValue("$country", record.Country ?? "");
        command.Parameters.AddWithValue("$role", record.Role ?? "");
        command.Parameters.AddWithValue("$status", record.Status);
        command.Parameters.AddWithValue("$note", record.Note ?? "");
        command.Parameters.AddWithValue("$temporaryPassword", record.TemporaryPassword ?? "");
        command.Parameters.AddWithValue("$requestedAt", record.RequestedAt.ToString("o"));
        command.Parameters.AddWithValue("$approvedAt", record.ApprovedAt?.ToString("o") ?? (object)DBNull.Value);
        command.Parameters.AddWithValue("$declinedAt", record.DeclinedAt?.ToString("o") ?? (object)DBNull.Value);
    }

    private static async Task<List<ApprovalRequestRecord>> ReadAllAsync(
        SqliteCommand command,
        CancellationToken cancellationToken)
    {
        var records = new List<ApprovalRequestRecord>();
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        while (await reader.ReadAsync(cancellationToken))
        {
            records.Add(new ApprovalRequestRecord
            {
                Id = reader.GetString(0),
                Email = reader.GetString(1),
                Name = reader.GetString(2),
                Country = reader.GetString(3),
                Role = reader.GetString(4),
                Status = reader.GetString(5),
                Note = reader.GetString(6),
                TemporaryPassword = reader.GetString(7),
                RequestedAt = DateTimeOffset.Parse(reader.GetString(8)),
                ApprovedAt = reader.IsDBNull(9) ? null : DateTimeOffset.Parse(reader.GetString(9)),
                DeclinedAt = reader.IsDBNull(10) ? null : DateTimeOffset.Parse(reader.GetString(10)),
            });
        }

        return records;
    }
}
