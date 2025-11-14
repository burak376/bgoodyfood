using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BGoodyFood.Admin.API.Data;
using BGoodyFood.Admin.API.Models;
using System.Security.Cryptography;
using System.Text;

namespace BGoodyFood.Admin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AdminDbContext _context;

    public UsersController(AdminDbContext context)
    {
        _context = context;
    }

    // GET: api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<AdminUser>>> GetUsers(
        [FromQuery] string? search = null,
        [FromQuery] bool? isActive = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.AdminUsers.AsQueryable();

        // Filters
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(u => u.Username.Contains(search) ||
                                   u.Email.Contains(search) ||
                                   u.FirstName!.Contains(search) ||
                                   u.LastName!.Contains(search));
        }

        if (isActive.HasValue)
        {
            query = query.Where(u => u.IsActive == isActive.Value);
        }

        // Pagination
        var total = await query.CountAsync();
        var users = await query
            .OrderByDescending(u => u.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.FirstName,
                u.LastName,
                u.PhoneNumber,
                u.IsActive,
                u.CreatedAt,
                u.LastLoginAt
            })
            .ToListAsync();

        return Ok(new
        {
            data = users,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }

    // GET: api/users/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult> GetUser(int id)
    {
        var user = await _context.AdminUsers
            .Where(u => u.Id == id)
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.FirstName,
                u.LastName,
                u.PhoneNumber,
                u.IsActive,
                u.CreatedAt,
                u.LastLoginAt,
                ProductCount = u.Products.Count
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        return Ok(user);
    }

    // POST: api/users
    [HttpPost]
    public async Task<ActionResult> CreateUser(CreateUserRequest request)
    {
        // Check if username exists
        if (await _context.AdminUsers.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest(new { message = "Username already exists" });
        }

        // Check if email exists
        if (await _context.AdminUsers.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new { message = "Email already exists" });
        }

        var user = new AdminUser
        {
            Username = request.Username,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            PasswordHash = HashPassword(request.Password),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.AdminUsers.Add(user);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new
        {
            user.Id,
            user.Username,
            user.Email,
            user.FirstName,
            user.LastName,
            user.PhoneNumber,
            user.IsActive,
            user.CreatedAt
        });
    }

    // PUT: api/users/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(int id, UpdateUserRequest request)
    {
        var user = await _context.AdminUsers.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Check if new username exists (excluding current user)
        if (request.Username != user.Username &&
            await _context.AdminUsers.AnyAsync(u => u.Username == request.Username && u.Id != id))
        {
            return BadRequest(new { message = "Username already exists" });
        }

        // Check if new email exists (excluding current user)
        if (request.Email != user.Email &&
            await _context.AdminUsers.AnyAsync(u => u.Email == request.Email && u.Id != id))
        {
            return BadRequest(new { message = "Email already exists" });
        }

        user.Username = request.Username;
        user.Email = request.Email;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        user.PhoneNumber = request.PhoneNumber;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PUT: api/users/{id}/password
    [HttpPut("{id}/password")]
    public async Task<IActionResult> ChangePassword(int id, ChangePasswordRequest request)
    {
        var user = await _context.AdminUsers.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Verify current password
        if (user.PasswordHash != HashPassword(request.CurrentPassword))
        {
            return BadRequest(new { message = "Current password is incorrect" });
        }

        user.PasswordHash = HashPassword(request.NewPassword);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Password changed successfully" });
    }

    // PUT: api/users/{id}/toggle-active
    [HttpPut("{id}/toggle-active")]
    public async Task<IActionResult> ToggleActive(int id)
    {
        var user = await _context.AdminUsers.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        user.IsActive = !user.IsActive;
        await _context.SaveChangesAsync();

        return Ok(new { isActive = user.IsActive });
    }

    // DELETE: api/users/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.AdminUsers.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        // Check if user has products
        var hasProducts = await _context.Products.AnyAsync(p => p.CreatedBy == id);
        if (hasProducts)
        {
            return BadRequest(new { message = "Cannot delete user with associated products" });
        }

        _context.AdminUsers.Remove(user);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // GET: api/users/stats
    [HttpGet("stats")]
    public async Task<ActionResult> GetStats()
    {
        var total = await _context.AdminUsers.CountAsync();
        var active = await _context.AdminUsers.CountAsync(u => u.IsActive);
        var inactive = total - active;
        var recentLogins = await _context.AdminUsers
            .Where(u => u.LastLoginAt >= DateTime.UtcNow.AddDays(-7))
            .CountAsync();

        return Ok(new
        {
            total,
            active,
            inactive,
            recentLogins
        });
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}

public class CreateUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
}

public class UpdateUserRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? PhoneNumber { get; set; }
}

public class ChangePasswordRequest
{
    public string CurrentPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
}
