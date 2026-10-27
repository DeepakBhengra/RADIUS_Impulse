namespace ImpulseSupportTool_Repo.Access;

public sealed class ApprovalRequestRecord
{
    public string Id { get; set; } = "";

    public string Email { get; set; } = "";

    public string Name { get; set; } = "";

    public string Country { get; set; } = "";

    public string[] Countries =>
        string.IsNullOrWhiteSpace(Country)
            ? []
            : Country.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

    public string Role { get; set; } = "";

    public string Status { get; set; } = "pending";

    public string Note { get; set; } = "";

    public string TemporaryPassword { get; set; } = "";

    public DateTimeOffset RequestedAt { get; set; }

    public DateTimeOffset? ApprovedAt { get; set; }

    public DateTimeOffset? DeclinedAt { get; set; }
}
