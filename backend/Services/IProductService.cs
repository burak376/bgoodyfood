using BGoodyFood.API.Dtos;

namespace BGoodyFood.API.Services;

public interface IProductService
{
    Task<ProductListDto> GetProductsAsync(string? search = null, string? category = null, string? sortBy = null, int page = 1, int pageSize = 20);
    Task<ProductDto?> GetProductByIdAsync(int id);
    Task<IEnumerable<ProductDto>> GetFeaturedProductsAsync();
    Task<ProductListDto> GetProductsByCategoryAsync(int categoryId, string? sortBy = null, int page = 1, int pageSize = 20);
}