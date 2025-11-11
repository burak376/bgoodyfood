namespace BGoodyFood.API.Models;

public class Order
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public required string OrderNumber { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal DiscountAmount { get; set; }
    public required string Status { get; set; } // Pending, Processing, Shipped, Delivered, Cancelled
    public required string ShippingAddress { get; set; }
    public required string BillingAddress { get; set; }
    public string? Notes { get; set; }
    public DateTime OrderDate { get; set; }
    public DateTime? ShippedDate { get; set; }
    public DateTime? DeliveredDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    
    // Navigation Properties
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}