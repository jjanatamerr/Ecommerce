using Ecommerce.ProductService.DTOs.Requests;
using Ecommerce.ProductService.DTOs.Responses;


namespace Ecommerce.ProductService.Services.Interfaces;

public interface IProductService
{
    Task<List<ProductResponse>> GetAllAsync();

    Task<ProductResponse?> GetByIdAsync(Guid id);

    Task<ProductResponse> CreateAsync(CreateProductRequest request);

    Task<ProductResponse?> UpdateAsync(
        Guid id,
        UpdateProductRequest request);

    Task<bool> DeleteAsync(Guid id);
}