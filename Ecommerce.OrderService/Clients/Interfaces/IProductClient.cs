namespace Ecommerce.OrderService.Clients.Interfaces;

public class ProductInfo
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
}

public interface IProductClient
{
    Task<ProductInfo?> GetProductAsync(Guid productId);
    Task<bool> DeductStockAsync(List<DeductStockItemDto> items);
    Task RestoreStockAsync(List<DeductStockItemDto> items);
}