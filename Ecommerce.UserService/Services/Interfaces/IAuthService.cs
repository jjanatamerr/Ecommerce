using Ecommerce.UserService.DTOs.Requests;
using Ecommerce.UserService.DTOs.Responses;

namespace Ecommerce.UserService.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
}