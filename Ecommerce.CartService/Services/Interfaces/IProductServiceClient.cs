namespace Ecommerce.CartService.Services.Interfaces
{
    public interface IProductServiceClient
    {
        Task<ProductDto?> GetProductAsync(Guid productId);
    }
}
