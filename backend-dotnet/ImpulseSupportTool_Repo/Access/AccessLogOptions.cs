namespace ImpulseSupportTool_Repo.Access;

public sealed class AccessLogOptions
{
    public string LogFile { get; set; } = Path.Combine("logs", "radius-users.log");
}
