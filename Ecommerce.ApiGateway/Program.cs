var builder = WebApplication.CreateBuilder(args);

// Loads Routes + Clusters from the "ReverseProxy" section of appsettings.json
builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowFrontend");

// This single line forwards every matching request to the right downstream service
app.MapReverseProxy();

app.Run();