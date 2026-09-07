using Ecommerce.OrderService.Clients.Interfaces;
using Ecommerce.OrderService.Data;
using Ecommerce.OrderService.DTOs.Requests;
using Ecommerce.OrderService.DTOs.Responses;
using Ecommerce.OrderService.Models;
using Ecommerce.OrderService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Ecommerce.OrderService.Services;

public class OrderService : IOrderService
{
    private readonly OrderDbContext _db;
    private readonly IProductClient _productClient;
    private readonly ILogger<OrderService> _logger;

    public OrderService(OrderDbContext db,IProductClient productClient,ILogger<OrderService> logger)
    {
        _db = db;
        _productClient = productClient;
        _logger = logger;
    }

    public async Task<OrderResponse> CheckoutAsync(Guid userId,CheckoutRequest request)
    {


        var existingOrder = await _db.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.IdempotencyKey == request.IdempotencyKey);

        if (existingOrder != null)
        {
            
            if (existingOrder.UserId != userId)
            {
                throw new InvalidOperationException("This idempotency key has already been used.");
            }

            _logger.LogInformation("Idempotent checkout request detected. " +"Returning existing order {OrderId} for user {UserId}.", existingOrder.Id, userId);

            return MapToResponse(existingOrder);
        }


        var orderItems = new List<OrderItem>();

        foreach (var item in request.Items)
        {

            var product = await _productClient.GetProductAsync(item.ProductId);

            if (product == null)
            {
                throw new KeyNotFoundException($"Product with ID '{item.ProductId}' was not found.");
            }

            if (item.Quantity > product.StockQuantity)
            {
                throw new InvalidOperationException( $"Insufficient stock for product '{product.Name}'. " +$"Available: {product.StockQuantity}, " + $"Requested: {item.Quantity}.");
            }

            var orderItem = new OrderItem
            {
                Id = Guid.NewGuid(),

                ProductId = product.Id,
                ProductName = product.Name,

                UnitPriceSnapshot = product.Price,

                Quantity = item.Quantity
            };

            orderItems.Add(orderItem);
        }


        var order = new Order
        {
            Id = Guid.NewGuid(),

            UserId = userId,

            IdempotencyKey = request.IdempotencyKey,

            Status = OrderStatus.Pending,

            CreatedAt = DateTime.UtcNow,

            Items = orderItems
        };

        order.TotalAmount = orderItems.Sum(item => item.UnitPriceSnapshot * item.Quantity);

        _db.Orders.Add(order);


        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {

            _logger.LogWarning("Possible idempotency race condition detected " +"for key {IdempotencyKey}.", request.IdempotencyKey);

            var raceOrder = await _db.Orders.AsNoTracking().Include(o => o.Items).FirstOrDefaultAsync(o => o.IdempotencyKey == request.IdempotencyKey);

            if (raceOrder != null)
            {
                if (raceOrder.UserId != userId)
                {
                    throw new InvalidOperationException(
                        "This idempotency key has already been used.");
                }

                return MapToResponse(raceOrder);
            }

            throw;
        }


        var paymentSucceeded =SimulatePayment(order.TotalAmount);

        if (paymentSucceeded)
        {
            order.Status = OrderStatus.Paid;
            order.UpdatedAt = DateTime.UtcNow;

            _logger.LogInformation("Payment succeeded for order {OrderId}. " +"Order marked as Paid.", order.Id);
        }
        else
        {
            order.Status = OrderStatus.Failed;
            order.UpdatedAt = DateTime.UtcNow;

            _logger.LogWarning(
                "Payment failed for order {OrderId}.",
                order.Id);
        }

        await _db.SaveChangesAsync();

        return MapToResponse(order);
    }

    public async Task<OrderResponse?> GetOrderByIdAsync(
        Guid userId,
        Guid orderId)
    {
        var order = await _db.Orders
            .AsNoTracking()
            .Include(o => o.Items)
            .FirstOrDefaultAsync(
                o =>
                    o.Id == orderId &&
                    o.UserId == userId);

        if (order == null)
        {
            return null;
        }

        return MapToResponse(order);
    }

    public async Task<List<OrderResponse>> GetMyOrdersAsync(Guid userId)
    {
        var orders = await _db.Orders
            .AsNoTracking()
            .Include(o => o.Items)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders
            .Select(MapToResponse)
            .ToList();
    }

    private static bool SimulatePayment(decimal amount)
    {
        return amount > 0;
    }

    private static OrderResponse MapToResponse(Order order)
    {
        return new OrderResponse
        {
            Id = order.Id,

            Status = order.Status.ToString(),

            TotalAmount = order.TotalAmount,

            CreatedAt = order.CreatedAt,

            Items = order.Items
                .Select(item => new OrderItemResponse
                {
                    ProductId = item.ProductId,

                    ProductName = item.ProductName,

                    UnitPrice = item.UnitPriceSnapshot,

                    Quantity = item.Quantity,

                    LineTotal =
                        item.UnitPriceSnapshot *
                        item.Quantity
                })
                .ToList()
        };
    }

    var stockItems = request.Items.Select(i => new DeductStockItemDto(i.ProductId, i.Quantity)).ToList();

    var stockDeducted = await _productClient.DeductStockAsync(stockItems);
    if (!stockDeducted)
        {
            throw new InvalidOperationException("One or more items are out of stock.");
        }
    _db.Orders.Add(order);
    await _db.SaveChangesAsync();
    var paymentSucceeded = SimulatePayment(order.TotalAmount);

    if (paymentSucceeded)
    {
        order.Status = OrderStatus.Paid;
        order.UpdatedAt = DateTime.UtcNow;
    }
    else
    {
        order.Status = OrderStatus.Failed;
        order.UpdatedAt = DateTime.UtcNow;
        await _productClient.RestoreStockAsync(stockItems);
    }

    await _db.SaveChangesAsync();
    return MapToResponse(order);

}
