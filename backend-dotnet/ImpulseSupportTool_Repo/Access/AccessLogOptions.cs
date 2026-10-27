namespace ImpulseSupportTool_Repo.Access;

public sealed class AccessLogOptions
{
    public string UsersDatabase { get; set; } = Path.Combine("logs", "radius-users.db");

    public string RequestsDatabase { get; set; } = Path.Combine("logs", "radius-requests.db");

    public string GuestsDatabase { get; set; } = Path.Combine("logs", "radius-guests.db");
}
