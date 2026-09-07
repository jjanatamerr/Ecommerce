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
        var response = await _httpClient.GetAsync($"/api/products/{productId}");

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        return await response.Content.ReadFromJsonAsync<ProductInfo>();
    }
    public async Task<bool> DeductStockAsync(List<DeductStockItemDto> items)
    {
        var response = await _httpClient.PostAsJsonAsync("/api/products/deduct-stock", new { Items = items });
        return response.IsSuccessStatusCode;
    }

    public async Task RestoreStockAsync(List<DeductStockItemDto> items)
    {
        await _httpClient.PostAsJsonAsync("/api/products/restore-stock", new { Items = items });
    }
}
