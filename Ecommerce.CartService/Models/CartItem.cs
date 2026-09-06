public class CartItem
{
    // Primary key
    public Guid CartItemId { get; set; }
    public Guid CartId { get; set; }
    public Cart Cart { get; set; } = null!;

    public Guid ProductId { get; set; }

    public int Quantity { get; set; }
}