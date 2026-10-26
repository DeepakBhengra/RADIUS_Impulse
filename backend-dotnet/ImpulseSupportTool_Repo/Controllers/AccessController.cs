using ImpulseSupportTool_Repo.Access;
using Microsoft.AspNetCore.Mvc;

namespace ImpulseSupportTool_Repo.Controllers;

[ApiController]
[Route("api/access")]
public sealed class AccessController : ControllerBase
{
    private readonly UserAccessLog _log;

    public AccessController(UserAccessLog log)
    {
        _log = log;
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
            Country = request.Country?.Trim() ?? "",
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
            return NotFound(new { message = "User was not found in the access log." });
        }

        if (!string.Equals(record.Password, request.Password, StringComparison.Ordinal))
        {
            return Unauthorized(new { message = "Production email or password was not recognized." });
        }

        return Ok(ToProfile(record));
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
            role = record.Role,
            temporary = record.Temporary,
        };
    }
}

public sealed class AccessUserRequest
{
    public string Event { get; set; } = "";

    public string Email { get; set; } = "";

    public string? Name { get; set; }

    public string? Country { get; set; }

    public string? Role { get; set; }

    public string Password { get; set; } = "";

    public bool Temporary { get; set; }
}

public sealed class AccessLoginRequest
{
    public string Email { get; set; } = "";

    public string Password { get; set; } = "";
}
