using Ecommerce.CartService.DTOs;
using Ecommerce.CartService.Services.Interfaces;

namespace Ecommerce.CartService.Services
{
    public class ProductServiceClient : IProductServiceClient
    {
        private readonly HttpClient _httpClient;

        public ProductServiceClient(HttpClient httpClient) => _httpClient = httpClient;

        public async Task<ProductDto?> GetProductAsync(Guid productId)
        {
            var response = await _httpClient.GetAsync($"/api/v1/products/{productId}");

            if (!response.IsSuccessStatusCode)
                return null;

            return await response.Content.ReadFromJsonAsync<ProductDto>();
        }
    }
}
