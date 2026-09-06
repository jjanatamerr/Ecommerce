using Ecommerce.CartService.Models;

public class Cart
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }   // just an ID, no navigation property, no FK constraint
    public List<CartItem> Items { get; set; } = new();
    public DateTime UpdatedAt { get; set; }

}