using Microsoft.Data.Sqlite;

namespace ImpulseSupportTool_Repo.Access;

public sealed class UserAccessLog
{
    private readonly string _path;
    private readonly SemaphoreSlim _gate = new(1, 1);
    private bool _ready;

    public UserAccessLog(string path)
    {
        _path = path;
    }

    public async Task AppendAsync(UserAccessRecord record, CancellationToken cancellationToken)
    {
        await using var connection = await ConnectAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            INSERT INTO prod_users (email, name, country, role, password, temporary, updated_at)
            VALUES ($email, $name, $country, $role, $password, $temporary, $updatedAt)
            ON CONFLICT(email) DO UPDATE SET
                name = excluded.name,
                country = excluded.country,
                role = excluded.role,
                password = excluded.password,
                temporary = excluded.temporary,
                updated_at = excluded.updated_at;
            """;
        command.Parameters.AddWithValue("$email", record.Email.Trim().ToLowerInvariant());
        command.Parameters.AddWithValue("$name", record.Name ?? "");
        command.Parameters.AddWithValue("$country", record.Country ?? "");
        command.Parameters.AddWithValue("$role", record.Role ?? "");
        command.Parameters.AddWithValue("$password", record.Password ?? "");
        command.Parameters.AddWithValue("$temporary", record.Temporary ? 1 : 0);
        command.Parameters.AddWithValue("$updatedAt", record.At.ToString("o"));
        await command.ExecuteNonQueryAsync(cancellationToken);
    }

    public async Task<UserAccessRecord?> LatestAsync(string email, CancellationToken cancellationToken)
    {
        await using var connection = await ConnectAsync(cancellationToken);
        await using var command = connection.CreateCommand();
        command.CommandText = """
            SELECT email, name, country, role, password, temporary, updated_at
            FROM prod_users
            WHERE email = $email
            LIMIT 1;
            """;
        command.Parameters.AddWithValue("$email", email.Trim().ToLowerInvariant());
        await using var reader = await command.ExecuteReaderAsync(cancellationToken);
        if (!await reader.ReadAsync(cancellationToken))
        {
            return null;
        }

        return new UserAccessRecord
        {
            Event = "approved",
            Email = reader.GetString(0),
            Name = reader.GetString(1),
            Country = reader.GetString(2),
            Role = reader.GetString(3),
            Password = reader.GetString(4),
            Temporary = reader.GetInt32(5) == 1,
            At = DateTimeOffset.Parse(reader.GetString(6)),
        };
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
                    CREATE TABLE IF NOT EXISTS prod_users (
                        email TEXT PRIMARY KEY COLLATE NOCASE,
                        name TEXT NOT NULL,
                        country TEXT NOT NULL,
                        role TEXT NOT NULL,
                        password TEXT NOT NULL,
                        temporary INTEGER NOT NULL,
                        updated_at TEXT NOT NULL
                    );
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
}
