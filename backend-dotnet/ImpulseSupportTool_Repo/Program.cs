using ImpulseSupportTool_Repo;
using OrderManagement.API.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value.Errors.Count > 0)
                .Select(e => new {
                    e.Key,
                    Errors = e.Value.Errors.Select(x => x.ErrorMessage)
                });
            Console.WriteLine($">>> MODEL BINDING ERROR: " +
                System.Text.Json.JsonSerializer.Serialize(errors));
            return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(errors);
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<EnvironmentMapper>();

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

try
{
    using var scope = app.Services.CreateScope();
    var svc = scope.ServiceProvider.GetRequiredService<IOrderService>();
    Console.WriteLine($">>> IOrderService resolved OK: {svc.GetType().Name}");
    var repo = scope.ServiceProvider.GetRequiredService<IOrderRepository>();
    Console.WriteLine($">>> IOrderRepository resolved OK: {repo.GetType().Name}");
}
catch (Exception ex)
{
    Console.WriteLine($">>> DI FAILED: {ex.Message}");
}

app.UseCors("FrontendPolicy");          // ✅ CORS first

app.Use(async (context, next) =>        // ✅ logger second
{
    Console.WriteLine($">>> REQUEST IN: {context.Request.Method} {context.Request.Path}");
    await next();
    Console.WriteLine($">>> RESPONSE OUT: {context.Response.StatusCode}");
});

app.UseSwagger();
app.UseSwaggerUI();

// ❌ app.UseAuthorization();           // ✅ COMMENTED OUT

app.MapControllers();

app.MapGet("/debug/routes", (IEnumerable<EndpointDataSource> sources) =>
    string.Join("\n", sources.SelectMany(s => s.Endpoints).Select(e => e.DisplayName))
);

app.Run();