using Ecommerce.CartService.DTOs.Responses;
using Ecommerce.CartService.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Ecommerce.CartService.Models;


namespace Ecommerce.CartService.Services
{

    public class CartService : ICartService
    {
        private readonly CartDbContext _db;
        private readonly IProductServiceClient _productServiceClient;

        public CartService(CartDbContext db, IProductServiceClient productServiceClient)
        {
            _db = db;
            _productServiceClient = productServiceClient;
        }

        private async Task<Cart> GetOrCreateCartEntityAsync(Guid userId)
        {
            var cart = await _db.Carts
                .Include(c => c.Items)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart is not null)
                return cart;

            cart = new Cart
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                Items = new List<CartItem>()
            };

            _db.Carts.Add(cart);
            await _db.SaveChangesAsync();

            return cart;
        }

        public async Task<CartDto> GetOrCreateCartAsync(Guid userId)
        {
            var cart = await GetOrCreateCartEntityAsync(userId);
            return ToDto(cart);
        }

        public async Task<CartDto> AddItemAsync(Guid userId, Guid productId, int quantity)
        {
            var cart = await GetOrCreateCartEntityAsync(userId);

            var product = await _productServiceClient.GetProductAsync(productId);
            if (product is null)
                throw new InvalidOperationException($"Product {productId} does not exist");

            if (product.StockQuantity < quantity)
                throw new InvalidOperationException("Not enough stock available");

            var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == productId);
            CartItem itemToTrack;

            if (existingItem is not null)
            {
                existingItem.Quantity += quantity;
                _db.Entry(existingItem).State = EntityState.Modified;
            }
            else
            {
                var newItem = new CartItem
                {
                    CartItemId = Guid.NewGuid(),
                    CartId = cart.Id,
                    ProductId = product.Id,
                    ProductName = product.Name,
                    UnitPrice = product.Price,
                    Quantity = quantity
                };
                cart.Items.Add(newItem);
                _db.CartItems.Add(newItem);   // explicitly tell EF to track this as Added
                itemToTrack = newItem;
            }


            await _db.SaveChangesAsync();
            return ToDto(cart);
        }

        public async Task<CartDto> UpdateItemQuantityAsync(Guid userId, Guid cartItemId, int quantity)
        {
            var cart = await GetOrCreateCartEntityAsync(userId);

            var item = cart.Items.FirstOrDefault(i => i.CartItemId == cartItemId);
            if (item is null)
                throw new InvalidOperationException("Cart item not found");

            if (quantity <= 0)
            {
                cart.Items.Remove(item);
                _db.CartItems.Remove(item);
            }
            else
            {
                item.Quantity = quantity;
            }

            await _db.SaveChangesAsync();
            return ToDto(cart);
        }

        public async Task<CartDto> RemoveItemAsync(Guid userId, Guid cartItemId)
        {
            var cart = await GetOrCreateCartEntityAsync(userId);

            var item = cart.Items.FirstOrDefault(i => i.CartItemId == cartItemId);
            if (item is null)
                throw new InvalidOperationException("Cart item not found");

            cart.Items.Remove(item);
            _db.CartItems.Remove(item);
            await _db.SaveChangesAsync();

            return ToDto(cart);
        }

        public async Task ClearCartAsync(Guid userId)
        {
            var cart = await GetOrCreateCartEntityAsync(userId);
            _db.CartItems.RemoveRange(cart.Items);
            await _db.SaveChangesAsync();
        }

        private static CartDto ToDto(Cart cart) => new(
            cart.Id,
            cart.UserId,
            cart.Items.Select(i => new CartItemDto(i.CartItemId, i.ProductId, i.ProductName, i.UnitPrice, i.Quantity)).ToList(),
            cart.Items.Sum(i => i.UnitPrice * i.Quantity),
            cart.CreatedAt
        );
    }
}