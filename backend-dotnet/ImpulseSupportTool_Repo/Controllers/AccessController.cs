using System.Security.Cryptography;
using ImpulseSupportTool_Repo.Access;
using Microsoft.AspNetCore.Mvc;

namespace ImpulseSupportTool_Repo.Controllers;

[ApiController]
[Route("api/access")]
public sealed class AccessController : ControllerBase
{
    private readonly UserAccessLog _log;
    private readonly ApprovalLog _requests;
    private readonly GuestLog _guests;
    private readonly AdminCredentialStore _admins;

    public AccessController(UserAccessLog log, ApprovalLog requests, GuestLog guests, AdminCredentialStore admins)
    {
        _log = log;
        _requests = requests;
        _guests = guests;
        _admins = admins;
    }

    [HttpPost("users")]
    public async Task<IActionResult> RecordUser(
        [FromBody] AccessUserRequest request,
        CancellationToken cancellationToken)
    {
        var validationError = Validate(request);
        if (validationError is not null)
        {
            return BadRequest(new { message = validationError });
        }

        var record = new UserAccessRecord
        {
            Event = request.Event.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Name = request.Name?.Trim() ?? "",
            Country = NormalizeCountries(request.Countries, request.Country),
            Role = request.Role?.Trim() ?? "",
            Password = request.Password,
            Temporary = request.Temporary,
            At = DateTimeOffset.UtcNow,
        };

        await _log.AppendAsync(record, cancellationToken);
        return Ok(ToProfile(record));
    }

    [HttpGet("users")]
    public async Task<IActionResult> FindUser(
        [FromQuery] string email,
        CancellationToken cancellationToken)
    {
        if (!IsEmail(email))
        {
            return BadRequest(new { message = "A valid email is required." });
        }

        var record = await _log.LatestAsync(email.Trim(), cancellationToken);
        if (record is null)
        {
            return NotFound(new { message = "User was not found in the access log." });
        }

        return Ok(ToProfile(record));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        [FromBody] AccessLoginRequest request,
        CancellationToken cancellationToken)
    {
        if (!IsCompanyEmail(request.Email))
        {
            return BadRequest(new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        if (string.IsNullOrEmpty(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        var record = await _log.LatestAsync(request.Email.Trim(), cancellationToken);
        if (record is null)
        {
            var approval = await _requests.LatestByEmailAsync(request.Email.Trim(), "access", cancellationToken);
            if (approval?.Status == "pending")
            {
                return StatusCode(StatusCodes.Status403Forbidden, new
                {
                    message = "An approval request for this email is waiting for an admin.",
                });
            }

            if (approval?.Status == "declined")
            {
                var note = string.IsNullOrWhiteSpace(approval.Note) ? "" : $" {approval.Note}";
                return StatusCode(StatusCodes.Status403Forbidden, new
                {
                    message = $"This request was declined.{note}",
                });
            }

            return NotFound(new { message = "User was not found in the access log." });
        }

        if (!string.Equals(record.Password, request.Password, StringComparison.Ordinal))
        {
            return Unauthorized(new { message = "Production email or password was not recognized." });
        }

        return Ok(ToProfile(record));
    }

    [HttpPost("admin-login")]
    public IActionResult AdminLogin([FromBody] AccessLoginRequest request)
    {
        if (!IsCompanyEmail(request.Email))
        {
            return BadRequest(new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        if (string.IsNullOrEmpty(request.Password))
        {
            return BadRequest(new { message = "Email and password are required." });
        }

        if (!_admins.IsReady)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable, new
            {
                message = "Admin sign-in is not configured on this server.",
            });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        if (!_admins.Authenticate(email, request.Password))
        {
            return Unauthorized(new { message = "Admin credentials were not recognized." });
        }

        return Ok(new
        {
            email,
            name = NameFromEmail(email),
            role = "Administrator",
        });
    }

    [HttpPost("guests")]
    public async Task<IActionResult> RecordGuest(
        [FromBody] GuestLoginRequest request,
        CancellationToken cancellationToken)
    {
        if (!IsCompanyEmail(request.Email))
        {
            return BadRequest(new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        if (string.IsNullOrWhiteSpace(request.Name) ||
            string.IsNullOrWhiteSpace(request.Country) ||
            string.IsNullOrWhiteSpace(request.Role))
        {
            return BadRequest(new { message = "Name, country, and role are required." });
        }

        var saved = await _guests.AddAsync(new GuestLoginRecord
        {
            Name = request.Name.Trim(),
            Email = request.Email.Trim().ToLowerInvariant(),
            Country = request.Country.Trim(),
            Role = request.Role.Trim(),
            SignedInAt = DateTimeOffset.UtcNow,
        }, cancellationToken);

        return StatusCode(StatusCodes.Status201Created, saved);
    }

    [HttpGet("guests")]
    public async Task<IActionResult> FindGuest(
        [FromQuery] string email,
        CancellationToken cancellationToken)
    {
        if (!IsCompanyEmail(email))
        {
            return BadRequest(new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        var guest = await _guests.LatestByEmailAsync(email, cancellationToken);
        if (guest is null)
        {
            return NotFound(new { message = "Guest was not found." });
        }

        return Ok(guest);
    }

    [HttpGet("requests")]
    public async Task<IActionResult> ListRequests(CancellationToken cancellationToken)
    {
        var requests = await _requests.ListLatestAsync(cancellationToken);
        return Ok(requests);
    }

    [HttpPost("requests")]
    public async Task<IActionResult> CreateRequest(
        [FromBody] ApprovalSubmitRequest request,
        CancellationToken cancellationToken)
    {
        if (!IsCompanyEmail(request.Email))
        {
            return BadRequest(new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        var countries = NormalizeCountries(request.Countries, request.Country);
        if (countries.Length == 0 || string.IsNullOrWhiteSpace(request.Role))
        {
            return BadRequest(new { message = "Select at least one country and a role." });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var existing = await _requests.LatestByEmailAsync(email, "access", cancellationToken);
        if (existing?.Status == "pending")
        {
            return Ok(new { status = "pending", request = existing });
        }

        if (existing?.Status == "declined" && !request.ReplaceDeclined)
        {
            return Ok(new { status = "declined", request = existing });
        }

        var existingUser = await _log.LatestAsync(email, cancellationToken);
        var requestedCountries = AdditionalCountries(existingUser?.Country, countries);
        if (existingUser is not null && requestedCountries.Length == 0)
        {
            return Ok(new
            {
                status = "already-have",
                countries = SplitCountries(existingUser.Country),
                message = "The selected countries already have production access.",
            });
        }

        var created = new ApprovalRequestRecord
        {
            Id = Guid.NewGuid().ToString(),
            Email = email,
            Name = string.IsNullOrWhiteSpace(existingUser?.Name)
                ? (string.IsNullOrWhiteSpace(request.Name) ? NameFromEmail(email) : request.Name.Trim())
                : existingUser.Name,
            Country = existingUser is null ? countries : requestedCountries,
            Role = string.IsNullOrWhiteSpace(existingUser?.Role) ? request.Role.Trim() : existingUser.Role,
            Kind = "access",
            Status = "pending",
            RequestedAt = DateTimeOffset.UtcNow,
        };
        await _requests.AppendAsync(created, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, new { status = "created", request = created });
    }

    [HttpPost("requests/{id}/approve")]
    public async Task<IActionResult> ApproveRequest(string id, CancellationToken cancellationToken)
    {
        var current = await _requests.LatestByIdAsync(id, cancellationToken);
        if (current is null || current.Status != "pending")
        {
            return NotFound(new { message = "This approval request was not found." });
        }

        var existingUser = await _log.LatestAsync(current.Email, cancellationToken);
        var isReset = string.Equals(current.Kind, "password_reset", StringComparison.OrdinalIgnoreCase);
        if (isReset && existingUser is null)
        {
            return NotFound(new { message = "This email does not have production access." });
        }

        var mergedCountries = isReset
            ? existingUser!.Country
            : MergeCountries(existingUser?.Country, current.Country);
        var password = existingUser?.Password ?? "";
        var temporary = existingUser?.Temporary ?? true;
        var issuedPassword = "";
        if (isReset || string.IsNullOrEmpty(password))
        {
            password = TemporaryPassword();
            temporary = true;
            issuedPassword = password;
        }

        await _log.AppendAsync(new UserAccessRecord
        {
            Event = "approved",
            Email = current.Email,
            Name = string.IsNullOrWhiteSpace(existingUser?.Name) ? current.Name : existingUser.Name,
            Country = mergedCountries,
            Role = string.IsNullOrWhiteSpace(existingUser?.Role) ? current.Role : existingUser.Role,
            Password = password,
            Temporary = temporary,
            At = DateTimeOffset.UtcNow,
        }, cancellationToken);

        var approved = Copy(current);
        approved.Status = "approved";
        approved.TemporaryPassword = issuedPassword;
        approved.Note = isReset
            ? "New temporary password created."
            : existingUser is null
                ? current.Note
                : "Existing production access kept. These countries were added.";
        approved.ApprovedAt = DateTimeOffset.UtcNow;
        await _requests.AppendAsync(approved, cancellationToken);
        return Ok(approved);
    }

    [HttpPost("requests/{id}/decline")]
    public async Task<IActionResult> DeclineRequest(
        string id,
        [FromBody] ApprovalDeclineRequest request,
        CancellationToken cancellationToken)
    {
        var note = request.Note?.Trim() ?? "";
        if (note.Length == 0)
        {
            return BadRequest(new { message = "Add a note before declining this request." });
        }

        var current = await _requests.LatestByIdAsync(id, cancellationToken);
        if (current is null || current.Status != "pending")
        {
            return NotFound(new { message = "This approval request was not found." });
        }

        var declined = Copy(current);
        declined.Status = "declined";
        declined.Note = note;
        declined.DeclinedAt = DateTimeOffset.UtcNow;
        await _requests.AppendAsync(declined, cancellationToken);
        return Ok(declined);
    }

    [HttpPost("password-resets")]
    public async Task<IActionResult> CreatePasswordReset(
        [FromBody] PasswordResetRequest request,
        CancellationToken cancellationToken)
    {
        if (!IsCompanyEmail(request.Email))
        {
            return BadRequest(new { message = "Only an @ingrammicro.com email ID can be used." });
        }

        var email = request.Email.Trim().ToLowerInvariant();
        var user = await _log.LatestAsync(email, cancellationToken);
        if (user is null)
        {
            return Ok(new
            {
                status = "unknown",
                message = "This email does not have production access.",
            });
        }

        var existing = await _requests.LatestByEmailAsync(email, "password_reset", cancellationToken);
        if (existing?.Status == "pending")
        {
            return Ok(new { status = "pending", request = existing });
        }

        var created = new ApprovalRequestRecord
        {
            Id = Guid.NewGuid().ToString(),
            Email = email,
            Name = string.IsNullOrWhiteSpace(user.Name) ? NameFromEmail(email) : user.Name,
            Country = user.Country,
            Role = user.Role,
            Kind = "password_reset",
            Status = "pending",
            RequestedAt = DateTimeOffset.UtcNow,
        };
        await _requests.AppendAsync(created, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, new { status = "created", request = created });
    }

    private static string? Validate(AccessUserRequest request)
    {
        if (request.Event is not ("approved" or "password_changed"))
        {
            return "Event must be approved or password_changed.";
        }

        if (!IsCompanyEmail(request.Email))
        {
            return "Only an @ingrammicro.com email ID can be used.";
        }

        if (string.IsNullOrEmpty(request.Password))
        {
            return "A password is required.";
        }

        return null;
    }

    private static bool IsEmail(string? email)
    {
        return IsCompanyEmail(email);
    }

    private static bool IsCompanyEmail(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return false;
        }

        var trimmed = email.Trim();
        var at = trimmed.IndexOf('@');
        if (at <= 0 || at != trimmed.LastIndexOf('@'))
        {
            return false;
        }

        return trimmed[(at + 1)..].Equals("ingrammicro.com", StringComparison.OrdinalIgnoreCase);
    }

    private static object ToProfile(UserAccessRecord record)
    {
        return new
        {
            email = record.Email,
            name = record.Name,
            country = record.Country,
            countries = SplitCountries(record.Country),
            role = record.Role,
            temporary = record.Temporary,
        };
    }

    private static ApprovalRequestRecord Copy(ApprovalRequestRecord current)
    {
        return new ApprovalRequestRecord
        {
            Id = current.Id,
            Email = current.Email,
            Name = current.Name,
            Country = current.Country,
            Role = current.Role,
            Kind = string.IsNullOrWhiteSpace(current.Kind) ? "access" : current.Kind,
            Status = current.Status,
            Note = current.Note,
            TemporaryPassword = current.TemporaryPassword,
            RequestedAt = current.RequestedAt,
            ApprovedAt = current.ApprovedAt,
            DeclinedAt = current.DeclinedAt,
        };
    }

    private static string NormalizeCountries(IEnumerable<string>? countries, string? country)
    {
        var tokens = new List<string>();
        if (countries is not null)
        {
            foreach (var item in countries)
            {
                if (!string.IsNullOrWhiteSpace(item))
                {
                    tokens.Add(item);
                }
            }
        }

        if (!string.IsNullOrWhiteSpace(country))
        {
            tokens.Add(country);
        }

        var unique = new List<string>();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var token in tokens)
        {
            foreach (var part in token.Split([',', ';'], StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
            {
                var code = part.Trim().ToUpperInvariant();
                if (code.Length is < 2 or > 3 || !code.All(char.IsLetterOrDigit))
                {
                    continue;
                }

                if (seen.Add(code))
                {
                    unique.Add(code);
                }
            }
        }

        return string.Join(',', unique);
    }

    private static string AdditionalCountries(string? owned, string requested)
    {
        var have = new HashSet<string>(SplitCountries(owned), StringComparer.OrdinalIgnoreCase);
        var extra = SplitCountries(requested).Where(code => !have.Contains(code)).ToArray();
        return string.Join(',', extra);
    }

    private static string MergeCountries(string? current, string? added)
    {
        var merged = new List<string>();
        var seen = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var code in SplitCountries(current).Concat(SplitCountries(added)))
        {
            if (seen.Add(code))
            {
                merged.Add(code);
            }
        }

        return string.Join(',', merged);
    }

    private static string[] SplitCountries(string? country)
    {
        if (string.IsNullOrWhiteSpace(country))
        {
            return [];
        }

        return country.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }

    private static string NameFromEmail(string email)
    {
        var local = email.Split('@')[0];
        var parts = local.Split(['.', '_', '+', '-'], StringSplitOptions.RemoveEmptyEntries);
        return string.Join(' ', parts.Select(part =>
            part.Length == 0
                ? ""
                : char.ToUpperInvariant(part[0]) + part[1..].ToLowerInvariant()));
    }

    private static string TemporaryPassword()
    {
        const string alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        const string digits = "23456789";
        var bytes = new byte[8];
        RandomNumberGenerator.Fill(bytes);
        char Pick(string set, int index) => set[bytes[index] % set.Length];
        return $"Tmp{Pick(digits, 0)}{Pick(alphabet, 1)}{Pick(alphabet, 2)}{Pick(alphabet, 3)}#{Pick(alphabet, 4)}{Pick(alphabet, 5)}{Pick(alphabet, 6)}{Pick(alphabet, 7)}";
    }
}

public sealed class ApprovalSubmitRequest
{
    public string Email { get; set; } = "";

    public string? Name { get; set; }

    public string? Country { get; set; }

    public List<string>? Countries { get; set; }

    public string? Role { get; set; }

    public bool ReplaceDeclined { get; set; }
}

public sealed class PasswordResetRequest
{
    public string Email { get; set; } = "";
}

public sealed class ApprovalDeclineRequest
{
    public string? Note { get; set; }
}

public sealed class GuestLoginRequest
{
    public string? Name { get; set; }

    public string Email { get; set; } = "";

    public string? Country { get; set; }

    public string? Role { get; set; }
}

public sealed class AccessUserRequest
{
    public string Event { get; set; } = "";

    public string Email { get; set; } = "";

    public string? Name { get; set; }

    public string? Country { get; set; }

    public List<string>? Countries { get; set; }

    public string? Role { get; set; }

    public string Password { get; set; } = "";

    public bool Temporary { get; set; }
}

public sealed class AccessLoginRequest
{
    public string Email { get; set; } = "";

    public string Password { get; set; } = "";
}
