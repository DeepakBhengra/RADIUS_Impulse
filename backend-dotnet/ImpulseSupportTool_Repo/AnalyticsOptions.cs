
namespace ImpulseSupportTool_Repo.Analytics;

public sealed class AnalyticsOptions
{
    public string LogDirectory { get; set; } = "App_Data/Analytics";

    public int QueueCapacity { get; set; } = 10000;
}
