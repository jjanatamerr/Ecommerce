using System.Security.Claims;
using Ecommerce.OrderService.DTOs.Requests;
using Ecommerce.OrderService.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.OrderService.Controllers;

[ApiController]
[Route("api/v1/orders")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost("checkout")]
    public async Task<IActionResult> Checkout(
        [FromBody] CheckoutRequest request)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                error = "Invalid user identity."
            });
        }

        try
        {
            var result = await _orderService.CheckoutAsync( userId.Value,request);

            return Ok(result);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                error = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                error = ex.Message
            });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                error = "Invalid user identity."
            });
        }

        var order = await _orderService.GetOrderByIdAsync( userId.Value,id);

        if (order == null)
        {
            return NotFound(new
            {
                error = "Order not found."
            });
        }

        return Ok(order);
    }


    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                error = "Invalid user identity."
            });
        }

        var orders = await _orderService.GetMyOrdersAsync(userId.Value);

        return Ok(orders);
    }


    private Guid? GetCurrentUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier) ?? User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null)
        {
            return null;
        }

        return Guid.TryParse(claim.Value, out var userId) ? userId: null;
    }
}