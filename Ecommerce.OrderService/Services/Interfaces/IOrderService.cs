using Ecommerce.OrderService.DTOs.Requests;
using Ecommerce.OrderService.DTOs.Responses;

namespace Ecommerce.OrderService.Services.Interfaces;

public interface IOrderService
{
    Task<OrderResponse> CheckoutAsync(Guid userId,CheckoutRequest request);

    Task<OrderResponse?> GetOrderByIdAsync(Guid userId, Guid orderId);

    Task<List<OrderResponse>> GetMyOrdersAsync(Guid userId);
}