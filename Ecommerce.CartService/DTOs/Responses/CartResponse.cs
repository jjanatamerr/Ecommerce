namespace Ecommerce.CartService.DTOs.Responses
{
    public record CartDto(Guid Id, Guid UserId, List<CartItemDto> Items, decimal Total, DateTime CreatedAt);

}
