using BGoodyFood.Admin.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace BGoodyFood.Admin.API.Data;

public static class SeedData
{
    public static void Initialize(AdminDbContext context)
    {
        // Check if database has been seeded
        if (context.AdminUsers.Any())
        {
            return;   // DB has been seeded
        }

        // Create default admin user
        var adminUser = new AdminUser
        {
            Username = "admin",
            Email = "admin@bgoodyfood.com",
            FirstName = "Admin",
            LastName = "User",
            PasswordHash = HashPassword("admin123"),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        context.AdminUsers.Add(adminUser);
        context.SaveChanges();

        // Create sample products
        var products = new[]
        {
            new Product
            {
                Name = "Organic Tomatoes",
                NameTR = "Organik Domatesler",
                Description = "Fresh, organic tomatoes grown without pesticides",
                DescriptionTR = "Pestisit kullanılmadan yetiştirilmiş taze organik domatesler",
                Price = 25.99m,
                OriginalPrice = 35.99m,
                Category = "Vegetables",
                CategoryTR = "Sebzeler",
                Badge = "New",
                BadgeTR = "Yeni",
                Rating = 4.8m,
                Reviews = 124,
                InStock = true,
                Stock = 100,
                Unit = "kg",
                UnitTR = "kg",
                Origin = "Turkey",
                OriginTR = "Türkiye",
                ImageUrl = "https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=400&h=400&fit=crop",
                AdditionalImages = "[\"https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=400&h=400&fit=crop\"]",
                IsOrganic = true,
                IsFeatured = true,
                CreatedBy = adminUser.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Fresh Apples",
                NameTR = "Taze Elmalar",
                Description = "Crisp and sweet organic apples",
                DescriptionTR = "Çıtır ve tatlı organik elmalar",
                Price = 18.50m,
                OriginalPrice = 22.00m,
                Category = "Fruits",
                CategoryTR = "Meyveler",
                Badge = "Popular",
                BadgeTR = "Popüler",
                Rating = 4.6m,
                Reviews = 89,
                InStock = true,
                Stock = 150,
                Unit = "kg",
                UnitTR = "kg",
                Origin = "Turkey",
                OriginTR = "Türkiye",
                ImageUrl = "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop",
                AdditionalImages = "[\"https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop\"]",
                IsOrganic = true,
                IsFeatured = true,
                CreatedBy = adminUser.Id,
                CreatedAt = DateTime.UtcNow
            },
            new Product
            {
                Name = "Organic Spinach",
                NameTR = "Organik Ispanak",
                Description = "Nutrient-rich organic spinach leaves",
                DescriptionTR = "Besin açısından zengin organik ıspanak yaprakları",
                Price = 12.75m,
                OriginalPrice = 15.00m,
                Category = "Vegetables",
                CategoryTR = "Sebzeler",
                Badge = "Sale",
                BadgeTR = "İndirim",
                Rating = 4.7m,
                Reviews = 156,
                InStock = true,
                Stock = 80,
                Unit = "bunch",
                UnitTR = "demet",
                Origin = "Turkey",
                OriginTR = "Türkiye",
                ImageUrl = "https://images.unsplash.com/photo-1576045057995-568f588f5fb0?w=400&h=400&fit=crop",
                AdditionalImages = "[\"https://images.unsplash.com/photo-1576045057995-568f588f5fb0?w=400&h=400&fit=crop\"]",
                IsOrganic = true,
                IsFeatured = false,
                CreatedBy = adminUser.Id,
                CreatedAt = DateTime.UtcNow
            }
        };

        context.Products.AddRange(products);
        context.SaveChanges();

        // Create sample orders
        var orders = new[]
        {
            new Order
            {
                OrderNumber = "ORD-001",
                CustomerName = "Ahmet Yılmaz",
                CustomerEmail = "ahmet@example.com",
                CustomerPhone = "555-123-4567",
                ShippingAddress = "İstanbul, Turkey",
                TotalAmount = 89.47m,
                ShippingCost = 15.00m,
                TaxAmount = 8.47m,
                DiscountAmount = 0,
                Status = "Delivered",
                PaymentStatus = "Paid",
                PaymentMethod = "Credit Card",
                OrderDate = DateTime.UtcNow.AddDays(-5),
                ShippedDate = DateTime.UtcNow.AddDays(-3),
                DeliveredDate = DateTime.UtcNow.AddDays(-1),
                Notes = "Delivered to front door"
            },
            new Order
            {
                OrderNumber = "ORD-002",
                CustomerName = "Ayşe Demir",
                CustomerEmail = "ayse@example.com",
                CustomerPhone = "555-987-6543",
                ShippingAddress = "Ankara, Turkey",
                TotalAmount = 156.25m,
                ShippingCost = 20.00m,
                TaxAmount = 14.25m,
                DiscountAmount = 10.00m,
                Status = "Processing",
                PaymentStatus = "Paid",
                PaymentMethod = "Bank Transfer",
                OrderDate = DateTime.UtcNow.AddDays(-2),
                Notes = "Customer requested gift wrapping"
            }
        };

        context.Orders.AddRange(orders);
        context.SaveChanges();

        // Create order items
        var orderItems = new[]
        {
            new OrderItem
            {
                OrderId = 1,
                ProductId = 1,
                ProductName = "Organic Tomatoes",
                UnitPrice = 25.99m,
                Quantity = 2,
                TotalPrice = 51.98m
            },
            new OrderItem
            {
                OrderId = 1,
                ProductId = 2,
                ProductName = "Fresh Apples",
                UnitPrice = 18.50m,
                Quantity = 1,
                TotalPrice = 18.50m
            },
            new OrderItem
            {
                OrderId = 2,
                ProductId = 1,
                ProductName = "Organic Tomatoes",
                UnitPrice = 25.99m,
                Quantity = 3,
                TotalPrice = 77.97m
            },
            new OrderItem
            {
                OrderId = 2,
                ProductId = 3,
                ProductName = "Organic Spinach",
                UnitPrice = 12.75m,
                Quantity = 4,
                TotalPrice = 51.00m
            }
        };

        context.OrderItems.AddRange(orderItems);
        context.SaveChanges();
    }

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }
}