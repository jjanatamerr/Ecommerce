using Ecommerce.CartService.DTOs.Requests;
using Ecommerce.CartService.DTOs.Responses;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService) => _cartService = cartService;

    // GET /api/cart/{userId}
    // Returns the user's cart, creating an empty one behind the scenes if it doesn't exist yet
    [HttpGet("{userId:guid}")]
    public async Task<ActionResult<CartDto>> GetCart(Guid userId)
    {
        try
        {
            var cart = await _cartService.GetOrCreateCartAsync(userId);
            return Ok(cart);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message); // user doesn't exist
        }
    }

    // POST /api/cart/{userId}/items
    [HttpPost("{userId:guid}/items")]
    public async Task<ActionResult<CartDto>> AddItem(Guid userId, [FromBody] AddCartItemRequest request)
    {
        try
        {
            var cart = await _cartService.AddItemAsync(userId, request.ProductId, request.Quantity);
            return Ok(cart);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // PUT /api/cart/{userId}/items/{cartItemId}
    [HttpPut("{userId:guid}/items/{cartItemId:guid}")]
    public async Task<ActionResult<CartDto>> UpdateItem(Guid userId, Guid cartItemId, [FromBody] UpdateCartItemRequest request)
    {
        try
        {
            var cart = await _cartService.UpdateItemQuantityAsync(userId, cartItemId, request.Quantity);
            return Ok(cart);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // DELETE /api/cart/{userId}/items/{cartItemId}
    [HttpDelete("{userId:guid}/items/{cartItemId:guid}")]
    public async Task<ActionResult<CartDto>> RemoveItem(Guid userId, Guid cartItemId)
    {
        try
        {
            var cart = await _cartService.RemoveItemAsync(userId, cartItemId);
            return Ok(cart);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ex.Message);
        }
    }

    // DELETE /api/cart/{userId}
    [HttpDelete("{userId:guid}")]
    public async Task<IActionResult> ClearCart(Guid userId)
    {
        await _cartService.ClearCartAsync(userId);
        return NoContent();
    }
}