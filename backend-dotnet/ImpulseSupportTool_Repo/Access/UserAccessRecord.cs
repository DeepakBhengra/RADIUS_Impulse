namespace ImpulseSupportTool_Repo.Access;

public sealed class UserAccessRecord
{
    public string Event { get; set; } = "";

    public string Email { get; set; } = "";

    public string Name { get; set; } = "";

    public string Country { get; set; } = "";

    public string Role { get; set; } = "";

    public string Password { get; set; } = "";

    public bool Temporary { get; set; }

    public DateTimeOffset At { get; set; }
}
