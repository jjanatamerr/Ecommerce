namespace Ecommerce.CartService.DTOs
{
    public record ProductDto(Guid Id, string Name, decimal Price, int StockQuantity);
}
