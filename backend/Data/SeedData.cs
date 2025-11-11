using BGoodyFood.API.Models;

namespace BGoodyFood.API.Data;

public static class SeedData
{
    public static async Task SeedAllData(BGoodyFoodDbContext context)
    {
        await SeedCategories(context);
        await SeedProducts(context);
    }

    private static async Task SeedCategories(BGoodyFoodDbContext context)
    {
        if (context.Categories.Any()) return;

        var categories = new List<Category>
        {
            new Category
            {
                Name = "Meyveler",
                Slug = "meyveler",
                Description = "Güneşin tadı",
                IconUrl = "/icons/fruits-icon.png",
                Gradient = "from-orange-400 to-red-500",
                ProductCount = 45,
                IsActive = true,
                SortOrder = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "Sebzeler",
                Slug = "sebzeler",
                Description = "Toprağın gücü",
                IconUrl = "/icons/vegetables-icon.png",
                Gradient = "from-green-400 to-emerald-500",
                ProductCount = 38,
                IsActive = true,
                SortOrder = 2,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "Bakliyat",
                Slug = "bakliyat",
                Description = "Enerji deposu",
                IconUrl = "/icons/legumes-icon.png",
                Gradient = "from-amber-400 to-yellow-500",
                ProductCount = 52,
                IsActive = true,
                SortOrder = 3,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "Süt Ürünleri",
                Slug = "sut-urunleri",
                Description = "Sağlık kaynağı",
                IconUrl = "/icons/dairy-icon.png",
                Gradient = "from-blue-400 to-indigo-500",
                ProductCount = 28,
                IsActive = true,
                SortOrder = 4,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "Et & Tavuk",
                Slug = "et-tavuk",
                Description = "Protein zengini",
                IconUrl = "/icons/meat-icon.png",
                Gradient = "from-red-500 to-pink-500",
                ProductCount = 31,
                IsActive = true,
                SortOrder = 5,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Category
            {
                Name = "Bal & Reçel",
                Slug = "bal-recel",
                Description = "Tatlı anlar",
                IconUrl = "/icons/honey-icon.png",
                Gradient = "from-purple-400 to-pink-500",
                ProductCount = 24,
                IsActive = true,
                SortOrder = 6,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        await context.Categories.AddRangeAsync(categories);
        await context.SaveChangesAsync();
    }

    private static async Task SeedProducts(BGoodyFoodDbContext context)
    {
        if (context.Products.Any()) return;

        var categories = await context.Categories.ToListAsync();
        var categoryMap = categories.ToDictionary(c => c.Slug, c => c.Id);

        var products = new List<Product>
        {
            // Meyveler
            new Product
            {
                Name = "Organik Elma",
                Description = "Vitamin ve lif açısından zengin, doğal yetiştirilmiş elmalar.",
                Tagline = "Crunchy & Sweet",
                Price = 32.50m,
                OriginalPrice = 45.00m,
                ImageUrl = "/products/apple.jpg",
                Badge = "YENİ",
                Rating = 4.8m,
                Reviews = 124,
                UnitDescription = "1kg",
                Discount = 28,
                Color = "from-red-400 to-pink-500",
                InStock = true,
                IsFeatured = true,
                CategoryId = categoryMap["meyveler"],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Organik Portakal",
                Description = "C vitamini deposu, taze ve sulu organik portakallar.",
                Tagline = "Vitamin C Bombası",
                Price = 28.90m,
                ImageUrl = "/products/orange.jpg",
                Badge = "YENİ",
                Rating = 4.5m,
                Reviews = 45,
                UnitDescription = "1kg",
                Discount = 0,
                Color = "from-orange-400 to-yellow-500",
                InStock = true,
                IsFeatured = true,
                CategoryId = categoryMap["meyveler"],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Organik Muz",
                Description = "Potasyum ve enerji kaynağı, doğal olgunlaşmış muzlar.",
                Tagline = "Enerji Kaynağı",
                Price = 42.90m,
                ImageUrl = "/products/banana.jpg",
                Badge = "POPÜLER",
                Rating = 4.7m,
                Reviews = 89,
                UnitDescription = "1kg",
                Discount = 0,
                Color = "from-yellow-400 to-orange-500",
                InStock = true,
                IsFeatured = true,
                CategoryId = categoryMap["meyveler"],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Sebzeler
            new Product
            {
                Name = "Organik Domates",
                Description = "Güneşte olgunlaşmış, lezzetli organik domatesler.",
                Tagline = "Baharatlı Lezzet",
                Price = 22.50m,
                ImageUrl = "/products/tomato.jpg",
                Badge = "TAZE",
                Rating = 4.6m,
                Reviews = 78,
                UnitDescription = "1kg",
                Discount = 0,
                Color = "from-red-600 to-orange-600",
                InStock = true,
                IsFeatured = true,
                CategoryId = categoryMap["sebzeler"],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Organik Salatalık",
                Description = "Taze ve crok, serinletici organik salatalıklar.",
                Tagline = "Serinletici Tazelik",
                Price = 18.90m,
                ImageUrl = "/products/cucumber.jpg",
                Badge = "YENİ",
                Rating = 4.4m,
                Reviews = 56,
                UnitDescription = "1kg",
                Discount = 0,
                Color = "from-green-500 to-emerald-600",
                InStock = true,
                IsFeatured = false,
                CategoryId = categoryMap["sebzeler"],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            // Diğer kategoriler için örnek ürünler...
        };

        await context.Products.AddRangeAsync(products);
        await context.SaveChangesAsync();
    }
}