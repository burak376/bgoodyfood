using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BGoodyFood.Admin.API.Models;

public class Order
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string OrderNumber { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string CustomerName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string CustomerEmail { get; set; } = string.Empty;
    
    [MaxLength(20)]
    public string? CustomerPhone { get; set; }
    
    [MaxLength(500)]
    public string? ShippingAddress { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal TotalAmount { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal ShippingCost { get; set; } = 0;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal TaxAmount { get; set; } = 0;
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal DiscountAmount { get; set; } = 0;
    
    public string Status { get; set; } = "Pending"; // Pending, Processing, Shipped, Delivered, Cancelled
    
    public string PaymentStatus { get; set; } = "Pending"; // Pending, Paid, Failed, Refunded
    
    public string PaymentMethod { get; set; } = string.Empty;
    
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    
    public DateTime? ShippedDate { get; set; }
    
    public DateTime? DeliveredDate { get; set; }
    
    [MaxLength(1000)]
    public string? Notes { get; set; }
    
    // Navigation properties
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}