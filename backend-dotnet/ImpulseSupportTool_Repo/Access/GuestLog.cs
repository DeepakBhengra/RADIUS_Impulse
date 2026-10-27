using Microsoft.Data.Sqlite;

namespace ImpulseSupportTool_Repo.Access;

public sealed class GuestLog
{
    private readonly string _path;
    private readonly SemaphoreSlim _gate = new(1, 1);
    private bool _ready;

    public GuestLog(string path)
    {
        _path = path;
    }

    public async Task<GuestLoginRecord> AddAsync(GuestLoginRecord record, CancellationToken cancellationToken)
    {
        await using var connection = await ConnectAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO guest_logins (name, email, country, role, signed_in_at)
            VALUES ($name, $email, $country, $role, $signedInAt);
            """;
        command.Parameters.AddWithValue("$name", record.Name ?? "");
        command.Parameters.AddWithValue("$email", record.Email.Trim().ToLowerInvariant());
        command.Parameters.AddWithValue("$country", record.Country ?? "");
        command.Parameters.AddWithValue("$role", record.Role ?? "");
        command.Parameters.AddWithValue("$signedInAt", record.SignedInAt.ToString("o"));
        await command.ExecuteNonQueryAsync(cancellationToken);

        command.Parameters.Clear();
        command.CommandText = "SELECT last_insert_rowid();";
        var id = await command.ExecuteScalarAsync(cancellationToken);
        record.Id = Convert.ToInt64(id);
        record.Email = record.Email.Trim().ToLowerInvariant();
        return record;
    }

    public async Task<GuestLoginRecord?> LatestByEmailAsync(string email, CancellationToken cancellationToken)
    {
        await using var connection = await ConnectAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT id, name, email, country, role, signed_in_at
            FROM guest_logins
            WHERE email = $email
            ORDER BY id DESC
            LIMIT 1;
            """;
        command.Parameters.AddWithValue("$email", email.Trim().ToLowerInvariant());
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
        {
            return null;
        }

        return Read(reader);
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
                    CREATE TABLE IF NOT EXISTS guest_logins (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        email TEXT NOT NULL COLLATE NOCASE,
                        country TEXT NOT NULL,
                        role TEXT NOT NULL,
                        signed_in_at TEXT NOT NULL
                    );
                    CREATE INDEX IF NOT EXISTS idx_guest_email ON guest_logins(email);
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

    private static GuestLoginRecord Read(SqliteDataReader reader)
    {
        return new GuestLoginRecord
        {
            Id = reader.GetInt64(0),
            Name = reader.GetString(1),
            Email = reader.GetString(2),
            Country = reader.GetString(3),
            Role = reader.GetString(4),
            SignedInAt = DateTimeOffset.Parse(reader.GetString(5)),
        };
    }
}

public sealed class GuestLoginRecord
{
    public long Id { get; set; }

    public string Name { get; set; } = "";

    public string Email { get; set; } = "";

    public string Country { get; set; } = "";

    public string Role { get; set; } = "";

    public DateTimeOffset SignedInAt { get; set; }
}
