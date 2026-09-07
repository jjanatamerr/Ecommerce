using Ecommerce.CartService.DTOs;

namespace Ecommerce.CartService.Services.Interfaces
{
    public interface IUserServiceClient
    {
        Task<UserDto?> GetUserAsync(Guid userId);
    }

    public class UserServiceClient : IUserServiceClient
    {
        private readonly HttpClient _httpClient;
        public UserServiceClient(HttpClient httpClient) => _httpClient = httpClient;

        public async Task<UserDto?> GetUserAsync(Guid userId)
        {
            var response = await _httpClient.GetAsync($"/api/users/{userId}");
            if (!response.IsSuccessStatusCode) return null;
            return await response.Content.ReadFromJsonAsync<UserDto>();
        }
    }

    public interface IProductServiceClient
    {
        Task<ProductDto?> GetProductAsync(Guid productId);
    }

    public class ProductServiceClient : IProductServiceClient
    {
        private readonly HttpClient _httpClient;
        public ProductServiceClient(HttpClient httpClient) => _httpClient = httpClient;

        public async Task<ProductDto?> GetProductAsync(Guid productId)
        {
            var response = await _httpClient.GetAsync($"/api/products/{productId}");
            if (!response.IsSuccessStatusCode) return null;
            return await response.Content.ReadFromJsonAsync<ProductDto>();
        }
    }
}
