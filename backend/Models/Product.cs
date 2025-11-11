namespace BGoodyFood.API.Models;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string Tagline { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public required string ImageUrl { get; set; }
    public required string Badge { get; set; }
    public decimal Rating { get; set; }
    public int Reviews { get; set; }
    public required string UnitDescription { get; set; }
    public int Discount { get; set; }
    public required string Color { get; set; }
    public bool InStock { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Foreign Keys
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
    
    // Navigation Properties
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}