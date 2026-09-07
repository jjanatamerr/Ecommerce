using Ecommerce.CartService.DTOs.Requests;
using Ecommerce.CartService.DTOs.Responses;
using Ecommerce.CartService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Ecommerce.CartService.Controllers
{
    [ApiController]
    [Route("api/cart")]
    [Authorize] // requires a valid JWT on every endpoint
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService) => _cartService = cartService;

        // Pulls UserId from the JWT claims instead of trusting the client
        private Guid GetUserId() =>
            Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // GET /api/cart
        [HttpGet]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var cart = await _cartService.GetOrCreateCartAsync(GetUserId());
            return Ok(cart);
        }

        // POST /api/cart/items
        [HttpPost("items")]
        public async Task<ActionResult<CartDto>> AddItem([FromBody] AddCartItemRequest request)
        {
            try
            {
                var cart = await _cartService.AddItemAsync(GetUserId(), request.ProductId, request.Quantity);
                return Ok(cart);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT /api/cart/items/{cartItemId}
        [HttpPut("items/{cartItemId:guid}")]
        public async Task<ActionResult<CartDto>> UpdateItem(Guid cartItemId, [FromBody] UpdateCartItemRequest request)
        {
            try
            {
                var cart = await _cartService.UpdateItemQuantityAsync(GetUserId(), cartItemId, request.Quantity);
                return Ok(cart);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // DELETE /api/cart/items/{cartItemId}
        [HttpDelete("items/{cartItemId:guid}")]
        public async Task<ActionResult<CartDto>> RemoveItem(Guid cartItemId)
        {
            try
            {
                var cart = await _cartService.RemoveItemAsync(GetUserId(), cartItemId);
                return Ok(cart);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // DELETE /api/cart
        [HttpDelete]
        public async Task<IActionResult> ClearCart()
        {
            await _cartService.ClearCartAsync(GetUserId());
            return NoContent();
        }
    }
}