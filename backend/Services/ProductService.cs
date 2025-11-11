using BGoodyFood.API.Data;
using BGoodyFood.API.Dtos;
using BGoodyFood.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BGoodyFood.API.Services;

public class ProductService : IProductService
{
    private readonly BGoodyFoodDbContext _context;

    public ProductService(BGoodyFoodDbContext context)
    {
        _context = context;
    }

    public async Task<ProductListDto> GetProductsAsync(string? search = null, string? category = null, string? sortBy = null, int page = 1, int pageSize = 20)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .AsQueryable();

        // Search filter
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(p => 
                p.Name.Contains(search) || 
                p.Description.Contains(search) || 
                p.Tagline.Contains(search) ||
                p.Category.Name.Contains(search));
        }

        // Category filter
        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.Category.Slug == category);
        }

        // Sorting
        query = sortBy switch
        {
            "price-low" => query.OrderBy(p => p.Price),
            "price-high" => query.OrderByDescending(p => p.Price),
            "rating" => query.OrderByDescending(p => p.Rating),
            "name" => query.OrderBy(p => p.Name),
            _ => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Tagline = p.Tagline,
                Price = p.Price,
                OriginalPrice = p.OriginalPrice,
                ImageUrl = p.ImageUrl,
                Badge = p.Badge,
                Rating = p.Rating,
                Reviews = p.Reviews,
                UnitDescription = p.UnitDescription,
                Discount = p.Discount,
                Color = p.Color,
                InStock = p.InStock,
                IsFeatured = p.IsFeatured,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                CategorySlug = p.Category.Slug
            })
            .ToListAsync();

        return new ProductListDto
        {
            Products = products,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }

    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null) return null;

        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Tagline = product.Tagline,
            Price = product.Price,
            OriginalPrice = product.OriginalPrice,
            ImageUrl = product.ImageUrl,
            Badge = product.Badge,
            Rating = product.Rating,
            Reviews = product.Reviews,
            UnitDescription = product.UnitDescription,
            Discount = product.Discount,
            Color = product.Color,
            InStock = product.InStock,
            IsFeatured = product.IsFeatured,
            CategoryId = product.CategoryId,
            CategoryName = product.Category.Name,
            CategorySlug = product.Category.Slug
        };
    }

    public async Task<IEnumerable<ProductDto>> GetFeaturedProductsAsync()
    {
        var products = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.IsFeatured && p.InStock)
            .OrderByDescending(p => p.CreatedAt)
            .Take(8)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Tagline = p.Tagline,
                Price = p.Price,
                OriginalPrice = p.OriginalPrice,
                ImageUrl = p.ImageUrl,
                Badge = p.Badge,
                Rating = p.Rating,
                Reviews = p.Reviews,
                UnitDescription = p.UnitDescription,
                Discount = p.Discount,
                Color = p.Color,
                InStock = p.InStock,
                IsFeatured = p.IsFeatured,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                CategorySlug = p.Category.Slug
            })
            .ToListAsync();

        return products;
    }

    public async Task<ProductListDto> GetProductsByCategoryAsync(int categoryId, string? sortBy = null, int page = 1, int pageSize = 20)
    {
        var query = _context.Products
            .Include(p => p.Category)
            .Where(p => p.CategoryId == categoryId && p.InStock)
            .AsQueryable();

        // Sorting
        query = sortBy switch
        {
            "price-low" => query.OrderBy(p => p.Price),
            "price-high" => query.OrderByDescending(p => p.Price),
            "rating" => query.OrderByDescending(p => p.Rating),
            "name" => query.OrderBy(p => p.Name),
            _ => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Tagline = p.Tagline,
                Price = p.Price,
                OriginalPrice = p.OriginalPrice,
                ImageUrl = p.ImageUrl,
                Badge = p.Badge,
                Rating = p.Rating,
                Reviews = p.Reviews,
                UnitDescription = p.UnitDescription,
                Discount = p.Discount,
                Color = p.Color,
                InStock = p.InStock,
                IsFeatured = p.IsFeatured,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                CategorySlug = p.Category.Slug
            })
            .ToListAsync();

        return new ProductListDto
        {
            Products = products,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }
}