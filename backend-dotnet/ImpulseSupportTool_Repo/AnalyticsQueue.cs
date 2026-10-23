
using System.Threading.Channels;
using ImpulseSupportTool_Repo.Analytics;

namespace ImpulseSupportTool_Repo.Analytics;

public sealed class AnalyticsQueue
{
    public Channel<AnalyticsEvent> Channel { get; }

    public AnalyticsQueue(AnalyticsOptions options)
    {
        if (options.QueueCapacity < 1)
        {
            throw new ArgumentOutOfRangeException(
                nameof(options.QueueCapacity));
        }

        Channel = System.Threading.Channels.Channel
            .CreateBounded<AnalyticsEvent>(
                new BoundedChannelOptions(options.QueueCapacity)
                {
                    FullMode = BoundedChannelFullMode.Wait,
                    SingleReader = true,
                    SingleWriter = false,
                    AllowSynchronousContinuations = false
                });
    }
}
