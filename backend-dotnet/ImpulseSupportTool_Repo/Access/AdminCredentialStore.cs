using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace ImpulseSupportTool_Repo.Access;

public sealed class AdminCredentialStore
{
    private static readonly byte[] Magic = "RVAULT1\n"u8.ToArray();
    private readonly Dictionary<string, byte[]> _passwords = new(StringComparer.Ordinal);

    public bool IsReady { get; }

    public AdminCredentialStore(IWebHostEnvironment environment, IConfiguration configuration)
    {
        try
        {
            var key = ReadKey(environment, configuration);
            var path = FindVault(environment);
            if (key is null || path is null)
            {
                Console.WriteLine(">>> Admin vault is not configured.");
                return;
            }

            Load(path, key);
            IsReady = _passwords.Count > 0;
            Console.WriteLine($">>> Admin vault loaded ({_passwords.Count} logins).");
        }
        catch (Exception)
        {
            Console.WriteLine(">>> Admin vault could not be opened.");
        }
    }

    public bool Authenticate(string email, string password)
    {
        if (!_passwords.TryGetValue(email.Trim().ToLowerInvariant(), out var expected))
        {
            return false;
        }

        var given = Encoding.UTF8.GetBytes(password);
        if (given.Length != expected.Length)
        {
            CryptographicOperations.FixedTimeEquals(expected, expected);
            return false;
        }

        return CryptographicOperations.FixedTimeEquals(expected, given);
    }

    private void Load(string path, byte[] key)
    {
        var payload = File.ReadAllBytes(path);
        if (payload.Length < Magic.Length + 12 + 16 + 2 ||
            !payload.AsSpan(0, Magic.Length).SequenceEqual(Magic))
        {
            throw new InvalidDataException("Admin vault header was not recognized.");
        }

        var nonce = payload.AsSpan(Magic.Length, 12);
        var tag = payload.AsSpan(Magic.Length + 12, 16);
        var cipher = payload.AsSpan(Magic.Length + 12 + 16);
        var plain = new byte[cipher.Length];
        using var aes = new AesGcm(key, 16);
        aes.Decrypt(nonce, cipher, tag, plain);

        var document = JsonSerializer.Deserialize<AdminVaultFile>(plain, new JsonSerializerOptions(JsonSerializerDefaults.Web));
        CryptographicOperations.ZeroMemory(plain);
        if (document?.Admins is null)
        {
            return;
        }

        foreach (var admin in document.Admins)
        {
            var email = admin.Email?.Trim().ToLowerInvariant() ?? "";
            if (email.Length == 0 || string.IsNullOrEmpty(admin.Password))
            {
                continue;
            }

            _passwords[email] = Encoding.UTF8.GetBytes(admin.Password);
        }
    }

    private static byte[]? ReadKey(IWebHostEnvironment environment, IConfiguration configuration)
    {
        var raw = configuration["AdminVault:Key"];
        if (string.IsNullOrWhiteSpace(raw))
        {
            raw = Environment.GetEnvironmentVariable("RADIUS_ADMIN_KEY");
        }

        if (string.IsNullOrWhiteSpace(raw))
        {
            var path = Path.Combine(environment.ContentRootPath, "admin-key.local");
            if (File.Exists(path))
            {
                raw = File.ReadAllText(path);
            }
        }

        if (string.IsNullOrWhiteSpace(raw))
        {
            return null;
        }

        try
        {
            var key = Convert.FromBase64String(raw.Trim());
            return key.Length == 32 ? key : null;
        }
        catch (FormatException)
        {
            return null;
        }
    }

    private static string? FindVault(IWebHostEnvironment environment)
    {
        var candidates = new[]
        {
            Path.Combine(environment.ContentRootPath, "Access", "admins.enc"),
            Path.Combine(AppContext.BaseDirectory, "Access", "admins.enc"),
        };
        return candidates.FirstOrDefault(File.Exists);
    }

    private sealed class AdminVaultFile
    {
        public List<AdminVaultEntry>? Admins { get; set; }
    }

    private sealed class AdminVaultEntry
    {
        public string? Email { get; set; }

        public string? Password { get; set; }
    }
}
