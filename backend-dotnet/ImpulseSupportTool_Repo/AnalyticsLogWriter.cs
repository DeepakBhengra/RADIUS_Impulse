
using System.Text.Json;
using ImpulseSupportTool_Repo.Analytics;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ImpulseSupportTool_Repo.Analytics;

public sealed class AnalyticsLogWriter : BackgroundService
{
    private readonly AnalyticsQueue _queue;
    private readonly ILogger<AnalyticsLogWriter> _logger;
    private readonly string _logDirectory;

    private static readonly JsonSerializerOptions JsonOptions =
        new(JsonSerializerDefaults.Web);

    public AnalyticsLogWriter(
        AnalyticsQueue queue,
        AnalyticsOptions options,
        ILogger<AnalyticsLogWriter> logger)
    {
        _queue = queue;
        _logger = logger;

        _logDirectory = Path.IsPathRooted(options.LogDirectory)
            ? options.LogDirectory
            : Path.Combine(
                AppContext.BaseDirectory,
                options.LogDirectory);

        Directory.CreateDirectory(_logDirectory);
    }

    protected override async Task ExecuteAsync(
        CancellationToken stoppingToken)
    {
        await foreach (var item in
            _queue.Channel.Reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                await WriteEventAsync(item, stoppingToken);
            }
            catch (OperationCanceledException)
                when (stoppingToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Failed to persist analytics event {EventType}",
                    item.EventType);

                // This sample does not retry the failed event.
                // Production deployments should add a retry/dead-letter
                // strategy if losing analytics events is unacceptable.
            }
        }
    }

    private async Task WriteEventAsync(
        AnalyticsEvent item,
        CancellationToken cancellationToken)
    {
        var fileName =
            $"radius-usage-{item.TimestampUtc:yyyy-MM-dd}.jsonl";

        var filePath = Path.Combine(_logDirectory, fileName);
        var json = JsonSerializer.Serialize(item, JsonOptions);

        await using var stream = new FileStream(
            filePath,
            FileMode.Append,
            FileAccess.Write,
            FileShare.Read,
            bufferSize: 4096,
            options: FileOptions.Asynchronous);

        await using var writer = new StreamWriter(stream);

        await writer.WriteLineAsync(json.AsMemory(), cancellationToken);
        await writer.FlushAsync(cancellationToken);
    }
}
