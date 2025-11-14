using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BGoodyFood.Admin.API.Data;
using BGoodyFood.Admin.API.Models;
using System.Security.Claims;

namespace BGoodyFood.Admin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly AdminDbContext _context;

    public ProductsController(AdminDbContext context)
    {
        _context = context;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
        [FromQuery] string? search = null,
        [FromQuery] string? category = null,
        [FromQuery] bool? isOrganic = null,
        [FromQuery] bool? isFeatured = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Products
            .Include(p => p.Creator)
            .Include(p => p.Updater)
            .AsQueryable();

        // Filters
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(p => p.Name.Contains(search) ||
                                   p.NameTR!.Contains(search) ||
                                   p.Description.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(p => p.Category == category);
        }

        if (isOrganic.HasValue)
        {
            query = query.Where(p => p.IsOrganic == isOrganic.Value);
        }

        if (isFeatured.HasValue)
        {
            query = query.Where(p => p.IsFeatured == isFeatured.Value);
        }

        // Pagination
        var total = await query.CountAsync();
        var products = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            data = products,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }

    // GET: api/products/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Creator)
            .Include(p => p.Updater)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
        {
            return NotFound(new { message = "Product not found" });
        }

        return Ok(product);
    }

    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        product.CreatedBy = userId.Value;
        product.CreatedAt = DateTime.UtcNow;

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    // PUT: api/products/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest(new { message = "ID mismatch" });
        }

        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        var existingProduct = await _context.Products.FindAsync(id);
        if (existingProduct == null)
        {
            return NotFound(new { message = "Product not found" });
        }

        // Update fields
        existingProduct.Name = product.Name;
        existingProduct.NameTR = product.NameTR;
        existingProduct.Description = product.Description;
        existingProduct.DescriptionTR = product.DescriptionTR;
        existingProduct.Price = product.Price;
        existingProduct.OriginalPrice = product.OriginalPrice;
        existingProduct.Category = product.Category;
        existingProduct.CategoryTR = product.CategoryTR;
        existingProduct.Badge = product.Badge;
        existingProduct.BadgeTR = product.BadgeTR;
        existingProduct.Rating = product.Rating;
        existingProduct.Reviews = product.Reviews;
        existingProduct.InStock = product.InStock;
        existingProduct.Stock = product.Stock;
        existingProduct.Unit = product.Unit;
        existingProduct.UnitTR = product.UnitTR;
        existingProduct.Origin = product.Origin;
        existingProduct.OriginTR = product.OriginTR;
        existingProduct.ImageUrl = product.ImageUrl;
        existingProduct.AdditionalImages = product.AdditionalImages;
        existingProduct.IsOrganic = product.IsOrganic;
        existingProduct.IsFeatured = product.IsFeatured;
        existingProduct.UpdatedAt = DateTime.UtcNow;
        existingProduct.UpdatedBy = userId.Value;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!ProductExists(id))
            {
                return NotFound();
            }
            throw;
        }

        return NoContent();
    }

    // DELETE: api/products/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = "Product not found" });
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // POST: api/products/{id}/toggle-featured
    [HttpPost("{id}/toggle-featured")]
    public async Task<IActionResult> ToggleFeatured(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = "Product not found" });
        }

        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        product.IsFeatured = !product.IsFeatured;
        product.UpdatedAt = DateTime.UtcNow;
        product.UpdatedBy = userId.Value;

        await _context.SaveChangesAsync();

        return Ok(new { isFeatured = product.IsFeatured });
    }

    // POST: api/products/{id}/toggle-organic
    [HttpPost("{id}/toggle-organic")]
    public async Task<IActionResult> ToggleOrganic(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound(new { message = "Product not found" });
        }

        var userId = GetCurrentUserId();
        if (userId == null)
        {
            return Unauthorized();
        }

        product.IsOrganic = !product.IsOrganic;
        product.UpdatedAt = DateTime.UtcNow;
        product.UpdatedBy = userId.Value;

        await _context.SaveChangesAsync();

        return Ok(new { isOrganic = product.IsOrganic });
    }

    // GET: api/products/categories
    [HttpGet("categories")]
    public async Task<ActionResult<IEnumerable<string>>> GetCategories()
    {
        var categories = await _context.Products
            .Select(p => p.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(categories);
    }

    // GET: api/products/stats
    [HttpGet("stats")]
    public async Task<ActionResult> GetStats()
    {
        var total = await _context.Products.CountAsync();
        var inStock = await _context.Products.CountAsync(p => p.InStock);
        var outOfStock = total - inStock;
        var organic = await _context.Products.CountAsync(p => p.IsOrganic);
        var featured = await _context.Products.CountAsync(p => p.IsFeatured);

        return Ok(new
        {
            total,
            inStock,
            outOfStock,
            organic,
            featured
        });
    }

    private bool ProductExists(int id)
    {
        return _context.Products.Any(e => e.Id == id);
    }

    private int? GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (int.TryParse(userIdClaim, out int userId))
        {
            return userId;
        }
        return null;
    }
}
