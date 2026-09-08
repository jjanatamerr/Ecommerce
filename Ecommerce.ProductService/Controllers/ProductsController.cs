using Ecommerce.ProductService.DTOs.Requests;
using Ecommerce.ProductService.DTOs.Responses;
using Ecommerce.ProductService.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.ProductService.Controllers;

[ApiController]
[Route("api/v1/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }


    [HttpGet]
    public async Task<ActionResult<List<ProductResponse>>> GetAll()
    {
        var products = await _productService.GetAllAsync();

        return Ok(products);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductResponse>> GetById(Guid id)
    {
        var product = await _productService.GetByIdAsync(id);

        if (product == null)
        {
            return NotFound($"Product with ID '{id}' was not found.");
        }

        return Ok(product);
    }


    [HttpPost]
    public async Task<ActionResult<ProductResponse>> Create(
        CreateProductRequest request)
    {
        var product = await _productService.CreateAsync(request);

        return CreatedAtAction(
            nameof(GetById),
            new { id = product.Id },
            product);
    }


    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProductResponse>> Update(
        Guid id,
        UpdateProductRequest request)
    {
        var product = await _productService.UpdateAsync(id, request);

        if (product == null)
        {
            return NotFound($"Product with ID '{id}' was not found.");
        }

        return Ok(product);
    }


    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _productService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound($"Product with ID '{id}' was not found.");
        }

        return NoContent();
    }
}