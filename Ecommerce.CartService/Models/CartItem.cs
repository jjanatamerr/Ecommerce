namespace Ecommerce.CartService.Models;

public class CartItem
{
    public Guid CartItemId { get; set; }

    public Guid CartId { get; set; }
    public Cart Cart { get; set; } = null!;

    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }
}
