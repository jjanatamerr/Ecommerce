using Ecommerce.OrderService.DTOs.Responses;
namespace Ecommerce.OrderService.Services.Interfaces
{
    public interface ICartClient
    {
        Task<CartDto?> GetCartAsync(Guid userId, string bearerToken);
        Task ClearCartAsync(Guid userId, string bearerToken);
    }
}
