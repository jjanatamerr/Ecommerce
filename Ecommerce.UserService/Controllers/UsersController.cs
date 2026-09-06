using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ecommerce.UserService.Data;

namespace Ecommerce.UserService.Controllers;

[ApiController]
[Route("api/v1/users")]
[Authorize] // requires a valid JWT
public class UsersController : ControllerBase
{
    private readonly UserDbContext _db;

    public UsersController(UserDbContext db)
    {
        _db = db;
    }

    // GET /api/v1/users/me -> returns the currently authenticated user
    [HttpGet("me")]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var user = await _db.Users.FindAsync(Guid.Parse(userId!));
        if (user is null) return NotFound();

        return Ok(new { user.Id, user.FullName, user.Email, Role = user.Role.ToString() });
    }

    // GET /api/v1/users -> Admin-only, example of role-based authorization
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _db.Users
            .Select(u => new { u.Id, u.FullName, u.Email, Role = u.Role.ToString() })
            .ToListAsync();

        return Ok(users);
    }
}