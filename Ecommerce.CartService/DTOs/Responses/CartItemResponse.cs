namespace Ecommerce.CartService.DTOs.Responses
{
    public record CartItemDto(Guid CartItemId, Guid ProductId, string ProductName, decimal UnitPrice, int Quantity);
}
