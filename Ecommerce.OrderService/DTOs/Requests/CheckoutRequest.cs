using System.ComponentModel.DataAnnotations;

namespace Ecommerce.OrderService.DTOs.Requests;

public class CheckoutRequest
{
    [Required]
    public string IdempotencyKey { get; set; } = string.Empty;

    [Required, MinLength(1)]
    public List<CheckoutItem> Items { get; set; } = new();
}

public class CheckoutItem
{
    [Required]
    public Guid ProductId { get; set; }

    [Required, Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}