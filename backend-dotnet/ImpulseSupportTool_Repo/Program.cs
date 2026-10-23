using ImpulseSupportTool_Repo;
using OrderManagement.API.Repositories;
using ImpulseSupportTool_Repo.Analytics;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------
// Controllers and model-binding error logging
// --------------------------------------------------
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value?.Errors.Count > 0)
                .Select(e => new
                {
                    e.Key,
                    Errors = e.Value!.Errors.Select(x => x.ErrorMessage)
                });

            Console.WriteLine(
                ">>> MODEL BINDING ERROR: " +
                System.Text.Json.JsonSerializer.Serialize(errors));

            return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(errors);
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --------------------------------------------------
// Existing Order Management services
// --------------------------------------------------
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<EnvironmentMapper>();

// --------------------------------------------------
// RADIUS Analytics configuration and services
// --------------------------------------------------
builder.Services.Configure<AnalyticsOptions>(
    builder.Configuration.GetSection("Analytics"));

// FIX: Register AnalyticsOptions directly because
// AnalyticsQueue expects AnalyticsOptions in its constructor.
builder.Services.AddSingleton(sp =>
    sp.GetRequiredService<IOptions<AnalyticsOptions>>().Value);

// One shared queue for API requests and the background writer.
builder.Services.AddSingleton<AnalyticsQueue>();

// Single background service consumes queued events and writes JSONL files.
builder.Services.AddHostedService<AnalyticsLogWriter>();

// --------------------------------------------------
// Existing CORS policy
// --------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// --------------------------------------------------
// Verify existing Order Management dependency injection
// --------------------------------------------------
try
{
    using var scope = app.Services.CreateScope();

    var svc = scope.ServiceProvider.GetRequiredService<IOrderService>();
    Console.WriteLine(
        $">>> IOrderService resolved OK: {svc.GetType().Name}");

    var repo = scope.ServiceProvider.GetRequiredService<IOrderRepository>();
    Console.WriteLine(
        $">>> IOrderRepository resolved OK: {repo.GetType().Name}");
}
catch (Exception ex)
{
    Console.WriteLine($">>> DI FAILED: {ex}");
}

// --------------------------------------------------
// Middleware
// --------------------------------------------------
app.UseCors("FrontendPolicy");

app.Use(async (context, next) =>
{
    Console.WriteLine(
        $">>> REQUEST IN: {context.Request.Method} {context.Request.Path}");

    await next();

    Console.WriteLine(
        $">>> RESPONSE OUT: {context.Response.StatusCode}");
});

app.UseSwagger();
app.UseSwaggerUI();

// Keep authorization middleware commented out as before.
app.MapControllers();

// --------------------------------------------------
// Existing debug endpoint
// --------------------------------------------------
app.MapGet("/debug/routes", (IEnumerable<EndpointDataSource> sources) =>
    string.Join(
        "\n",
        sources.SelectMany(s => s.Endpoints)
            .Select(e => e.DisplayName))
);

app.Run();