using System.ComponentModel.DataAnnotations;

namespace Ecommerce.OrderService.DTOs.Requests
{
    public class CheckoutRequest
    {
        [Required]
        public string IdempotencyKey { get; set; } = string.Empty;
    }
}



