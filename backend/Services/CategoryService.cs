using BGoodyFood.API.Data;
using BGoodyFood.API.Dtos;
using BGoodyFood.API.Models;
using Microsoft.EntityFrameworkCore;

namespace BGoodyFood.API.Services;

public class CategoryService : ICategoryService
{
    private readonly BGoodyFoodDbContext _context;

    public CategoryService(BGoodyFoodDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync()
    {
        var categories = await _context.Categories
            .Where(c => c.IsActive)
            .OrderBy(c => c.SortOrder)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Slug = c.Slug,
                Description = c.Description,
                IconUrl = c.IconUrl,
                Gradient = c.Gradient,
                ProductCount = c.ProductCount,
                IsActive = c.IsActive,
                SortOrder = c.SortOrder
            })
            .ToListAsync();

        return categories;
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

        if (category == null) return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            IconUrl = category.IconUrl,
            Gradient = category.Gradient,
            ProductCount = category.ProductCount,
            IsActive = category.IsActive,
            SortOrder = category.SortOrder
        };
    }

    public async Task<CategoryDto?> GetCategoryBySlugAsync(string slug)
    {
        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Slug == slug && c.IsActive);

        if (category == null) return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Slug = category.Slug,
            Description = category.Description,
            IconUrl = category.IconUrl,
            Gradient = category.Gradient,
            ProductCount = category.ProductCount,
            IsActive = category.IsActive,
            SortOrder = category.SortOrder
        };
    }
}