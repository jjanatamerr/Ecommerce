namespace Ecommerce.OrderService.Clients.Interfaces
{
    public interface IProductClient
    {
        Task<ProductInfo?> GetProductAsync(Guid productId);
    }
}

public class ProductInfo
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int StockQuantity { get; set; }
}
