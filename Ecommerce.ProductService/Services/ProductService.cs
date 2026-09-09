using Ecommerce.ProductService.Data;
using Ecommerce.ProductService.DTOs.Requests;
using Ecommerce.ProductService.DTOs.Responses;
using Ecommerce.ProductService.Models;
using Ecommerce.ProductService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.ProductService.Services;

public class ProductService : IProductService
{
    private readonly ProductDbContext _db;
    private readonly ILogger<ProductService> _logger;

    public ProductService(
        ProductDbContext db,
        ILogger<ProductService> logger)
    {
        _db = db;
        _logger = logger;
    }


    public async Task<List<ProductResponse>> GetAllAsync()
    {
        var products = await _db.Products
            .AsNoTracking()
            .ToListAsync();

        return products
            .Select(MapToResponse)
            .ToList();
    }


    public async Task<ProductResponse?> GetByIdAsync(Guid id)
    {
        var product = await _db.Products
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return null;
        }

        return MapToResponse(product);
    }


    public async Task<ProductResponse> CreateAsync(
        CreateProductRequest request)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            StockQuantity = request.StockQuantity,
            Category = request.Category,
            ImageUrl = request.ImageUrl
        };

        _db.Products.Add(product);

        await _db.SaveChangesAsync();

        _logger.LogInformation(
            "Product {ProductId} created successfully.",
            product.Id);

        return MapToResponse(product);
    }


    public async Task<ProductResponse?> UpdateAsync(
        Guid id,
        UpdateProductRequest request)
    {
        var product = await _db.Products
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return null;
        }

        product.Name = request.Name;
        product.Description = request.Description;
        product.Price = request.Price;
        product.StockQuantity = request.StockQuantity;
        product.Category = request.Category;
        product.ImageUrl = request.ImageUrl;

        await _db.SaveChangesAsync();

        _logger.LogInformation(
            "Product {ProductId} updated successfully.",
            product.Id);

        return MapToResponse(product);
    }


    public async Task<bool> DeleteAsync(Guid id)
    {
        var product = await _db.Products
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return false;
        }

        _db.Products.Remove(product);

        await _db.SaveChangesAsync();

        _logger.LogInformation(
            "Product {ProductId} deleted successfully.",
            product.Id);

        return true;
    }


    private static ProductResponse MapToResponse(Product product)
    {
        return new ProductResponse
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            Category = product.Category,
            ImageUrl = product.ImageUrl
        };
    }
    public async Task<bool> DecreaseStockAsync(Guid id, int quantity)
    {
        var product = await _db.Products
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return false;
        }

        if (product.StockQuantity < quantity)
        {
            return false;
        }

        product.StockQuantity -= quantity;

        await _db.SaveChangesAsync();

        _logger.LogInformation(
            "Stock decreased for product {ProductId}. New stock: {StockQuantity}",
            product.Id,
            product.StockQuantity);

        return true;
    }
    
}