using Ecommerce.OrderService.Services.Interfaces;
using System.Net.Http.Headers;
using Ecommerce.OrderService.DTOs.Responses;

namespace Ecommerce.OrderService.Services
{
    public class CartClient : ICartClient
    {
        private readonly HttpClient _httpClient;
        public CartClient(HttpClient httpClient) => _httpClient = httpClient;

        public async Task<CartDto?> GetCartAsync(Guid userId, string bearerToken)
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/cart");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;
            return await response.Content.ReadFromJsonAsync<CartDto>();
        }

        public async Task ClearCartAsync(Guid userId, string bearerToken)
        {
            var request = new HttpRequestMessage(HttpMethod.Delete, "/api/cart");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);
            await _httpClient.SendAsync(request);
        }
    }
}
