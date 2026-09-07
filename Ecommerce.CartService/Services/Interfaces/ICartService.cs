using Ecommerce.CartService.DTOs;
using Ecommerce.CartService.DTOs.Responses;

namespace Ecommerce.CartService.Services.Interfaces
{
    public interface ICartService
    {
        Task<CartDto> GetOrCreateCartAsync(Guid userId);
        Task<CartDto> AddItemAsync(Guid userId, Guid productId, int quantity);
        Task<CartDto> UpdateItemQuantityAsync(Guid userId, Guid cartItemId, int quantity);
        Task<CartDto> RemoveItemAsync(Guid userId, Guid cartItemId);
        Task ClearCartAsync(Guid userId);
    }
}
