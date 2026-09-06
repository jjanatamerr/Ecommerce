using System.Net.Http.Json;
using Ecommerce.OrderService.Clients.Interfaces;

namespace Ecommerce.OrderService.Clients;

public class ProductClient : IProductClient
{
    private readonly HttpClient _httpClient;

    public ProductClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ProductInfo?> GetProductAsync(Guid productId)
    {
        var response = await _httpClient.GetAsync($"/api/v1/products/{productId}");

        if (!response.IsSuccessStatusCode)
            return null;

        return await response.Content.ReadFromJsonAsync<ProductInfo>();
    }
}