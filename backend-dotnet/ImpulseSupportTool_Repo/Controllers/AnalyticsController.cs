
using System.Globalization;
using System.Text.Json;
using System.Threading.Channels;
using ImpulseSupportTool_Repo.Analytics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ImpulseSupportTool_Repo.Analytics;

namespace ImpulseSupportTool_Repo.Controllers;

[ApiController]
[Route("api/analytics")]
public sealed class AnalyticsController : ControllerBase
{
    private readonly AnalyticsQueue _queue;
    private readonly string _logDirectory;

    private static readonly JsonSerializerOptions JsonOptions =
        new(JsonSerializerDefaults.Web);

    public AnalyticsController(
        AnalyticsQueue queue,
        IOptions<AnalyticsOptions> options)
    {
        _queue = queue;

        var configuredPath = options.Value.LogDirectory;

        _logDirectory = Path.IsPathRooted(configuredPath)
            ? configuredPath
            : Path.Combine(
                AppContext.BaseDirectory,
                configuredPath);

        Directory.CreateDirectory(_logDirectory);
    }

    // POST /api/analytics/events
    [HttpPost("events")]
    public async Task<IActionResult> RecordEvent(
        [FromBody] AnalyticsEventRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.SessionId) ||
            request.SessionId.Length > 100)
        {
            return BadRequest(new
            {
                message = "A valid sessionId is required."
            });
        }

        if (request.EventType == AnalyticsEventTypes.TabView)
        {
            if (request.Tab is null ||
                !AnalyticsTabNames.All.Contains(request.Tab) ||
                request.Outcome is not null)
            {
                return BadRequest(new
                {
                    message = "Invalid tab-view event."
                });
            }
        }
        else if (request.EventType == AnalyticsEventTypes.OrderSearch)
        {
            if (request.Tab is not null ||
                request.Outcome is not ("success" or "failure"))
            {
                return BadRequest(new
                {
                    message =
                        "Order-search events require a success or failure outcome."
                });
            }
        }
        else
        {
            return BadRequest(new
            {
                message = "Unsupported event type."
            });
        }

        var analyticsEvent = new AnalyticsEvent
        {
            TimestampUtc = DateTime.UtcNow,
            SessionId = request.SessionId,
            EventType = request.EventType,
            Tab = request.Tab,
            Outcome = request.Outcome
        };

        try
        {
            await _queue.Channel.Writer.WriteAsync(
                analyticsEvent, cancellationToken);

            return Accepted(new
            {
                message = "Analytics event accepted."
            });
        }
        catch (OperationCanceledException)
            when (cancellationToken.IsCancellationRequested)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable,
                new { message = "Event was not accepted." });
        }
        catch (ChannelClosedException)
        {
            return StatusCode(StatusCodes.Status503ServiceUnavailable,
                new { message = "Analytics service is unavailable." });
        }
    }

    // GET /api/analytics/summary?days=30
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary(
        [FromQuery] int days = 30,
        [FromQuery] string? startDate = null,
        [FromQuery] string? endDate = null,
        CancellationToken cancellationToken = default)
    {
        if (!TryResolveDateRange(startDate, endDate, days, out var rangeStart, out var rangeEnd, out var rangeError))
        {
            return BadRequest(new { message = rangeError });
        }

        var startDateValue = rangeStart;
        var today = rangeEnd;

        var tabCounts = new Dictionary<string, int>();
        var tabSessions = new Dictionary<string, HashSet<string>>();
        var dailyCounts = new SortedDictionary<string, int>();

        var totalTabViews = 0;
        var totalSearches = 0;
        var successfulSearches = 0;
        var failedSearches = 0;

        for (var date = startDateValue; date <= today; date = date.AddDays(1))
        {
            cancellationToken.ThrowIfCancellationRequested();

            var dateKey = date.ToString("yyyy-MM-dd");
            var filePath = GetLogPath(dateKey);
            var dailyTabViews = 0;

            if (System.IO.File.Exists(filePath))
            {
                using var stream = new FileStream(
                    filePath,
                    FileMode.Open,
                    FileAccess.Read,
                    FileShare.ReadWrite | FileShare.Delete,
                    4096,
                    FileOptions.Asynchronous |
                    FileOptions.SequentialScan);

                using var reader = new StreamReader(stream);

                while (await reader.ReadLineAsync(cancellationToken)
                    is { } line)
                {
                    try
                    {
                        var item = JsonSerializer.Deserialize<AnalyticsEvent>(
                            line, JsonOptions);

                        if (item is null)
                            continue;

                        if (item.EventType == AnalyticsEventTypes.TabView &&
                            item.Tab is not null &&
                            AnalyticsTabNames.All.Contains(item.Tab))
                        {
                            totalTabViews++;
                            dailyTabViews++;

                            tabCounts[item.Tab] =
                                tabCounts.GetValueOrDefault(item.Tab) + 1;

                            if (!tabSessions.TryGetValue(
                                item.Tab, out var sessions))
                            {
                                sessions = new HashSet<string>(
                                    StringComparer.Ordinal);

                                tabSessions[item.Tab] = sessions;
                            }

                            sessions.Add(item.SessionId);
                        }
                        else if (item.EventType ==
                                 AnalyticsEventTypes.OrderSearch)
                        {
                            totalSearches++;

                            if (item.Outcome == "success")
                                successfulSearches++;
                            else if (item.Outcome == "failure")
                                failedSearches++;
                        }
                    }
                    catch (JsonException)
                    {
                        // Skip malformed lines and continue reading.
                    }
                }
            }

            dailyCounts[dateKey] = dailyTabViews;
        }

        var tabs = AnalyticsTabNames.All
            .Select(tab => new
            {
                tab,
                views = tabCounts.GetValueOrDefault(tab),
                uniqueSessions = tabSessions.TryGetValue(
                    tab, out var sessions)
                    ? sessions.Count
                    : 0
            })
            .OrderByDescending(x => x.views)
            .ToList();

        return Ok(new
        {
            startDate = startDateValue.ToString("yyyy-MM-dd"),
            endDate = today.ToString("yyyy-MM-dd"),
            totalTabViews,
            totalSearches,
            successfulSearches,
            failedSearches,
            tabs,
            dailyActivity = dailyCounts.Select(x => new
            {
                date = x.Key,
                tabViews = x.Value
            })
        });
    }

    // GET /api/analytics/daily?days=7
    [HttpGet("daily")]
    public async Task<IActionResult> GetDaily(
        [FromQuery] int days = 7,
        [FromQuery] string? startDate = null,
        [FromQuery] string? endDate = null,
        CancellationToken cancellationToken = default)
    {
        if (!TryResolveDateRange(startDate, endDate, days, out var rangeStart, out var rangeEnd, out var rangeError))
        {
            return BadRequest(new { message = rangeError });
        }

        var today = rangeEnd;
        var results = new List<object>();

        for (var date = rangeStart;
             date <= today;
             date = date.AddDays(1))
        {
            cancellationToken.ThrowIfCancellationRequested();

            var path = GetLogPath(date.ToString("yyyy-MM-dd"));
            var counts = new Dictionary<string, int>();

            if (System.IO.File.Exists(path))
            {
                using var stream = new FileStream(
                    path,
                    FileMode.Open,
                    FileAccess.Read,
                    FileShare.ReadWrite | FileShare.Delete,
                    4096,
                    FileOptions.Asynchronous |
                    FileOptions.SequentialScan);

                using var reader = new StreamReader(stream);

                while (await reader.ReadLineAsync(cancellationToken)
                    is { } line)
                {
                    try
                    {
                        var item = JsonSerializer.Deserialize<AnalyticsEvent>(
                            line, JsonOptions);

                        if (item?.EventType == AnalyticsEventTypes.TabView &&
                            item.Tab is not null &&
                            AnalyticsTabNames.All.Contains(item.Tab))
                        {
                            counts[item.Tab] =
                                counts.GetValueOrDefault(item.Tab) + 1;
                        }
                    }
                    catch (JsonException)
                    {
                        // Ignore malformed lines.
                    }
                }
            }

            results.Add(new
            {
                date = date.ToString("yyyy-MM-dd"),
                totalTabViews = counts.Values.Sum(),
                tabs = counts
            });
        }

        return Ok(results);
    }

    // GET /api/analytics/export?date=2026-10-14
    [HttpGet("export")]
    public IActionResult Export([FromQuery] string? date)
    {
        if (!DateOnly.TryParseExact(
            date,
            "yyyy-MM-dd",
            CultureInfo.InvariantCulture,
            DateTimeStyles.None,
            out var selectedDate))
        {
            return BadRequest(new
            {
                message = "Use date format yyyy-MM-dd."
            });
        }

        var path = GetLogPath(
            selectedDate.ToString("yyyy-MM-dd"));

        if (!System.IO.File.Exists(path))
        {
            return NotFound(new
            {
                message = "No log exists for the selected date."
            });
        }

        return PhysicalFile(
            path,
            "application/x-ndjson",
            Path.GetFileName(path));
    }

    private static bool TryResolveDateRange(
        string? startDateText,
        string? endDateText,
        int days,
        out DateTime startDate,
        out DateTime endDate,
        out string? error)
    {
        error = null;
        var hasStart = !string.IsNullOrWhiteSpace(startDateText);
        var hasEnd = !string.IsNullOrWhiteSpace(endDateText);

        if (hasStart != hasEnd)
        {
            startDate = endDate = default;
            error = "Provide both startDate and endDate, using yyyy-MM-dd.";
            return false;
        }

        if (hasStart && hasEnd)
        {
            if (!DateOnly.TryParseExact(startDateText, "yyyy-MM-dd",
                    CultureInfo.InvariantCulture, DateTimeStyles.None, out var start) ||
                !DateOnly.TryParseExact(endDateText, "yyyy-MM-dd",
                    CultureInfo.InvariantCulture, DateTimeStyles.None, out var end))
            {
                startDate = endDate = default;
                error = "Use yyyy-MM-dd for startDate and endDate.";
                return false;
            }

            startDate = start.ToDateTime(TimeOnly.MinValue);
            endDate = end.ToDateTime(TimeOnly.MinValue);
            if (startDate > endDate)
            {
                error = "startDate must be on or before endDate.";
                return false;
            }

            if (endDate.Date > DateTime.UtcNow.Date)
            {
                error = "Future dates are not supported.";
                return false;
            }

            if ((endDate - startDate).TotalDays >= 365)
            {
                error = "The selected date range must be 365 days or less.";
                return false;
            }

            return true;
        }

        if (days < 1 || days > 365)
        {
            startDate = endDate = default;
            error = "days must be between 1 and 365.";
            return false;
        }

        endDate = DateTime.UtcNow.Date;
        startDate = endDate.AddDays(-(days - 1));
        return true;
    }

    private string GetLogPath(string date)
    {
        // Date is generated internally or validated as yyyy-MM-dd.
        return Path.Combine(
            _logDirectory, $"radius-usage-{date}.jsonl");
    }

    [HttpGet("recent-tabs")]
    public async Task<IActionResult> GetRecentTabs(
        [FromQuery] string? sessionId,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(sessionId) || sessionId.Length > 100)
        {
            return BadRequest(new { message = "A valid sessionId is required." });
        }

        if (!Directory.Exists(_logDirectory))
        {
            return Ok(new
            {
                count = 0,
                recentTabs = Array.Empty<object>()
            });
        }

        var events = new List<AnalyticsEvent>();
        var sessionEvents = new List<AnalyticsEvent>();

        var logFiles = Directory.GetFiles(
            _logDirectory,
            "radius-usage-*.jsonl");

        var jsonOptions = new System.Text.Json.JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        };

        foreach (var file in logFiles)
        {
            var lines = await System.IO.File.ReadAllLinesAsync(file);

            foreach (var line in lines)
            {
                if (string.IsNullOrWhiteSpace(line))
                    continue;

                try
                {
                    var analyticsEvent =
                        System.Text.Json.JsonSerializer
                            .Deserialize<AnalyticsEvent>(
                                line, jsonOptions);

                    if (analyticsEvent != null &&
                        string.Equals(
                            analyticsEvent.EventType,
                            "tab_view",
                            StringComparison.OrdinalIgnoreCase) &&
                        !string.IsNullOrWhiteSpace(analyticsEvent.Tab))
                    {
                        events.Add(analyticsEvent);
                        if (string.Equals(
                                analyticsEvent.SessionId,
                                sessionId,
                                StringComparison.Ordinal))
                        {
                            sessionEvents.Add(analyticsEvent);
                        }
                    }
                }
                catch (System.Text.Json.JsonException)
                {
                    // Skip malformed log entries.
                }
            }
        }

        var source = sessionEvents.Count > 0 ? sessionEvents : events;
        var recentTabs = source
            .OrderByDescending(e => e.TimestampUtc)
            .Take(5)
            .Select(e => new
            {
                tab = e.Tab,
                sessionId = e.SessionId,
                timestampUtc = e.TimestampUtc
            })
            .ToList();

        return Ok(new
        {
            count = recentTabs.Count,
            recentTabs
        });
    }
}
