using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BGoodyFood.Admin.API.Data;

namespace BGoodyFood.Admin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AdminDbContext _context;

    public DashboardController(AdminDbContext context)
    {
        _context = context;
    }

    // GET: api/dashboard/summary
    [HttpGet("summary")]
    public async Task<ActionResult> GetSummary()
    {
        var today = DateTime.UtcNow.Date;
        var thisMonth = new DateTime(DateTime.UtcNow.Year, DateTime.UtcNow.Month, 1);

        // Products
        var totalProducts = await _context.Products.CountAsync();
        var productsInStock = await _context.Products.CountAsync(p => p.InStock);
        var organicProducts = await _context.Products.CountAsync(p => p.IsOrganic);
        var featuredProducts = await _context.Products.CountAsync(p => p.IsFeatured);

        // Orders
        var totalOrders = await _context.Orders.CountAsync();
        var pendingOrders = await _context.Orders.CountAsync(o => o.Status == "Pending");
        var processingOrders = await _context.Orders.CountAsync(o => o.Status == "Processing");
        var todayOrders = await _context.Orders.CountAsync(o => o.OrderDate >= today);
        var monthOrders = await _context.Orders.CountAsync(o => o.OrderDate >= thisMonth);

        // Revenue
        var totalRevenue = await _context.Orders
            .Where(o => o.PaymentStatus == "Paid")
            .SumAsync(o => o.TotalAmount);

        var todayRevenue = await _context.Orders
            .Where(o => o.OrderDate >= today && o.PaymentStatus == "Paid")
            .SumAsync(o => o.TotalAmount);

        var monthRevenue = await _context.Orders
            .Where(o => o.OrderDate >= thisMonth && o.PaymentStatus == "Paid")
            .SumAsync(o => o.TotalAmount);

        // Users
        var totalUsers = await _context.AdminUsers.CountAsync();
        var activeUsers = await _context.AdminUsers.CountAsync(u => u.IsActive);

        return Ok(new
        {
            products = new
            {
                total = totalProducts,
                inStock = productsInStock,
                organic = organicProducts,
                featured = featuredProducts
            },
            orders = new
            {
                total = totalOrders,
                pending = pendingOrders,
                processing = processingOrders,
                today = todayOrders,
                month = monthOrders
            },
            revenue = new
            {
                total = totalRevenue,
                today = todayRevenue,
                month = monthRevenue
            },
            users = new
            {
                total = totalUsers,
                active = activeUsers
            }
        });
    }

    // GET: api/dashboard/recent-orders
    [HttpGet("recent-orders")]
    public async Task<ActionResult> GetRecentOrders([FromQuery] int count = 10)
    {
        var orders = await _context.Orders
            .OrderByDescending(o => o.OrderDate)
            .Take(count)
            .Select(o => new
            {
                o.Id,
                o.OrderNumber,
                o.CustomerName,
                o.TotalAmount,
                o.Status,
                o.PaymentStatus,
                o.OrderDate
            })
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/dashboard/top-products
    [HttpGet("top-products")]
    public async Task<ActionResult> GetTopProducts([FromQuery] int count = 10)
    {
        var products = await _context.Products
            .OrderByDescending(p => p.Reviews)
            .ThenByDescending(p => p.Rating)
            .Take(count)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Price,
                p.Rating,
                p.Reviews,
                p.InStock,
                p.Category
            })
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/dashboard/low-stock
    [HttpGet("low-stock")]
    public async Task<ActionResult> GetLowStockProducts([FromQuery] int threshold = 10)
    {
        var products = await _context.Products
            .Where(p => p.Stock <= threshold && p.InStock)
            .OrderBy(p => p.Stock)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Stock,
                p.Unit,
                p.Category
            })
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/dashboard/sales-chart
    [HttpGet("sales-chart")]
    public async Task<ActionResult> GetSalesChart([FromQuery] int days = 30)
    {
        var startDate = DateTime.UtcNow.AddDays(-days).Date;

        var data = await _context.Orders
            .Where(o => o.OrderDate >= startDate)
            .GroupBy(o => o.OrderDate.Date)
            .Select(g => new
            {
                date = g.Key,
                orders = g.Count(),
                revenue = g.Where(o => o.PaymentStatus == "Paid").Sum(o => o.TotalAmount)
            })
            .OrderBy(x => x.date)
            .ToListAsync();

        // Fill missing dates with zero values
        var allDates = Enumerable.Range(0, days)
            .Select(i => startDate.AddDays(i))
            .ToList();

        var result = allDates.Select(date => new
        {
            date = date,
            orders = data.FirstOrDefault(d => d.date == date)?.orders ?? 0,
            revenue = data.FirstOrDefault(d => d.date == date)?.revenue ?? 0
        }).ToList();

        return Ok(result);
    }

    // GET: api/dashboard/category-distribution
    [HttpGet("category-distribution")]
    public async Task<ActionResult> GetCategoryDistribution()
    {
        var distribution = await _context.Products
            .GroupBy(p => p.Category)
            .Select(g => new
            {
                category = g.Key,
                count = g.Count(),
                inStock = g.Count(p => p.InStock),
                organic = g.Count(p => p.IsOrganic)
            })
            .OrderByDescending(x => x.count)
            .ToListAsync();

        return Ok(distribution);
    }

    // GET: api/dashboard/order-status-distribution
    [HttpGet("order-status-distribution")]
    public async Task<ActionResult> GetOrderStatusDistribution()
    {
        var distribution = await _context.Orders
            .GroupBy(o => o.Status)
            .Select(g => new
            {
                status = g.Key,
                count = g.Count(),
                revenue = g.Where(o => o.PaymentStatus == "Paid").Sum(o => o.TotalAmount)
            })
            .ToListAsync();

        return Ok(distribution);
    }

    // GET: api/dashboard/monthly-comparison
    [HttpGet("monthly-comparison")]
    public async Task<ActionResult> GetMonthlyComparison([FromQuery] int months = 6)
    {
        var startDate = DateTime.UtcNow.AddMonths(-months);

        var data = await _context.Orders
            .Where(o => o.OrderDate >= startDate)
            .GroupBy(o => new { o.OrderDate.Year, o.OrderDate.Month })
            .Select(g => new
            {
                year = g.Key.Year,
                month = g.Key.Month,
                orders = g.Count(),
                revenue = g.Where(o => o.PaymentStatus == "Paid").Sum(o => o.TotalAmount),
                customers = g.Select(o => o.CustomerEmail).Distinct().Count()
            })
            .OrderBy(x => x.year)
            .ThenBy(x => x.month)
            .ToListAsync();

        return Ok(data);
    }
}
