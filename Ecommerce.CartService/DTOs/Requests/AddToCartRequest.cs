namespace Ecommerce.CartService.DTOs.Requests
{
    public record AddCartItemRequest(Guid ProductId, int Quantity);
}
