using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BGoodyFood.Admin.API.Models;

public class Product
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;
    
    [MaxLength(200)]
    public string? NameTR { get; set; }
    
    [Required]
    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? DescriptionTR { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; }
    
    [Column(TypeName = "decimal(10,2)")]
    public decimal? OriginalPrice { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Category { get; set; } = string.Empty;
    
    [MaxLength(100)]
    public string? CategoryTR { get; set; }
    
    [MaxLength(50)]
    public string? Badge { get; set; }
    
    [MaxLength(50)]
    public string? BadgeTR { get; set; }
    
    [Column(TypeName = "decimal(3,2)")]
    public decimal Rating { get; set; } = 0;
    
    public int Reviews { get; set; } = 0;
    
    public bool InStock { get; set; } = true;
    
    public int Stock { get; set; } = 0;
    
    [MaxLength(50)]
    public string? Unit { get; set; }
    
    [MaxLength(50)]
    public string? UnitTR { get; set; }
    
    [MaxLength(100)]
    public string? Origin { get; set; }
    
    [MaxLength(100)]
    public string? OriginTR { get; set; }
    
    public string? ImageUrl { get; set; }
    
    public string? AdditionalImages { get; set; } // JSON array
    
    public bool IsOrganic { get; set; } = false;
    
    public bool IsFeatured { get; set; } = false;
    
    public int CreatedBy { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? UpdatedAt { get; set; }
    
    public int? UpdatedBy { get; set; }
    
    // Navigation properties
    public virtual AdminUser Creator { get; set; } = null!;
    public virtual AdminUser? Updater { get; set; }
}