using Microsoft.EntityFrameworkCore;


public class CartDbContext : DbContext
{
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cart>()
            .HasKey(c => c.Id);

        modelBuilder.Entity<CartItem>()
            .HasKey(ci => ci.CartItemId);

        // Real one-to-many FK relationship — same service
        modelBuilder.Entity<CartItem>()
            .HasOne(ci => ci.Cart)
            .WithMany(c => c.Items)
            .HasForeignKey(ci => ci.CartId)
            .OnDelete(DeleteBehavior.Cascade); // deleting a cart deletes its items

        // ProductId is just a plain column — no HasOne/WithMany,
        // because Product doesn't exist in this DbContext at all
        modelBuilder.Entity<CartItem>()
            .Property(ci => ci.ProductId)
            .IsRequired();
    }
}