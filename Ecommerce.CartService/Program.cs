using Ecommerce.CartService.Services;
using Ecommerce.CartService.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();


builder.Services.AddHttpClient<IProductServiceClient, ProductServiceClient>(client =>
{
    client.BaseAddress = new Uri("https://product-service.internal/");
    // or for local dev, something like:
    // client.BaseAddress = new Uri("https://localhost:5003/");
});

builder.Services.AddScoped<ICartService, CartService>();

app.UseAuthorization();

app.MapControllers();

app.Run();
