
namespace ImpulseSupportTool_Repo.Analytics;

public static class AnalyticsEventTypes
{
    public const string TabView = "tab_view";
    public const string OrderSearch = "order_search";
}

public static class AnalyticsTabNames
{
    public const string OrderDetails = "order_details";
    public const string LineItems = "line_items";
    public const string ProcessingFlow = "processing_flow";
    public const string FlowTraceStatus = "flow_trace_status";
    public const string PoSwitch = "po_switch";
    public const string SetupConfiguration = "setup_configuration";
    public const string LogsExport = "logs_export";

    public static readonly HashSet<string> All =
        new(StringComparer.Ordinal)
        {
            OrderDetails,
            LineItems,
            ProcessingFlow,
            FlowTraceStatus,
            PoSwitch,
            SetupConfiguration,
            LogsExport
        };
}

public sealed record AnalyticsEventRequest
{
    public string SessionId { get; init; } = "";
    public string EventType { get; init; } = "";
    public string? Tab { get; init; }
    public string? Outcome { get; init; }
}

public sealed record AnalyticsEvent
{
    public DateTime TimestampUtc { get; init; }
    public string SessionId { get; init; } = "";
    public string EventType { get; init; } = "";
    public string? Tab { get; init; }
    public string? Outcome { get; init; }
}
