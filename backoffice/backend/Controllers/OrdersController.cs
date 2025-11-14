using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BGoodyFood.Admin.API.Data;
using BGoodyFood.Admin.API.Models;

namespace BGoodyFood.Admin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly AdminDbContext _context;

    public OrdersController(AdminDbContext context)
    {
        _context = context;
    }

    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders(
        [FromQuery] string? search = null,
        [FromQuery] string? status = null,
        [FromQuery] string? paymentStatus = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .AsQueryable();

        // Filters
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(o => o.OrderNumber.Contains(search) ||
                                   o.CustomerName.Contains(search) ||
                                   o.CustomerEmail.Contains(search));
        }

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(o => o.Status == status);
        }

        if (!string.IsNullOrWhiteSpace(paymentStatus))
        {
            query = query.Where(o => o.PaymentStatus == paymentStatus);
        }

        if (startDate.HasValue)
        {
            query = query.Where(o => o.OrderDate >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(o => o.OrderDate <= endDate.Value);
        }

        // Pagination
        var total = await query.CountAsync();
        var orders = await query
            .OrderByDescending(o => o.OrderDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new
        {
            data = orders,
            total,
            page,
            pageSize,
            totalPages = (int)Math.Ceiling(total / (double)pageSize)
        });
    }

    // GET: api/orders/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        return Ok(order);
    }

    // PUT: api/orders/{id}/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        order.Status = request.Status;

        // Update dates based on status
        if (request.Status == "Shipped" && !order.ShippedDate.HasValue)
        {
            order.ShippedDate = DateTime.UtcNow;
        }
        else if (request.Status == "Delivered" && !order.DeliveredDate.HasValue)
        {
            order.DeliveredDate = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Order status updated", status = order.Status });
    }

    // PUT: api/orders/{id}/payment-status
    [HttpPut("{id}/payment-status")]
    public async Task<IActionResult> UpdatePaymentStatus(int id, [FromBody] UpdatePaymentStatusRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        order.PaymentStatus = request.PaymentStatus;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Payment status updated", paymentStatus = order.PaymentStatus });
    }

    // PUT: api/orders/{id}/notes
    [HttpPut("{id}/notes")]
    public async Task<IActionResult> UpdateNotes(int id, [FromBody] UpdateNotesRequest request)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        order.Notes = request.Notes;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Notes updated" });
    }

    // GET: api/orders/stats
    [HttpGet("stats")]
    public async Task<ActionResult> GetStats()
    {
        var total = await _context.Orders.CountAsync();
        var pending = await _context.Orders.CountAsync(o => o.Status == "Pending");
        var processing = await _context.Orders.CountAsync(o => o.Status == "Processing");
        var shipped = await _context.Orders.CountAsync(o => o.Status == "Shipped");
        var delivered = await _context.Orders.CountAsync(o => o.Status == "Delivered");
        var cancelled = await _context.Orders.CountAsync(o => o.Status == "Cancelled");

        var totalRevenue = await _context.Orders
            .Where(o => o.PaymentStatus == "Paid")
            .SumAsync(o => o.TotalAmount);

        var todayOrders = await _context.Orders
            .CountAsync(o => o.OrderDate.Date == DateTime.UtcNow.Date);

        var todayRevenue = await _context.Orders
            .Where(o => o.OrderDate.Date == DateTime.UtcNow.Date && o.PaymentStatus == "Paid")
            .SumAsync(o => o.TotalAmount);

        return Ok(new
        {
            total,
            pending,
            processing,
            shipped,
            delivered,
            cancelled,
            totalRevenue,
            todayOrders,
            todayRevenue
        });
    }

    // GET: api/orders/recent
    [HttpGet("recent")]
    public async Task<ActionResult<IEnumerable<Order>>> GetRecentOrders([FromQuery] int count = 5)
    {
        var orders = await _context.Orders
            .Include(o => o.OrderItems)
            .OrderByDescending(o => o.OrderDate)
            .Take(count)
            .ToListAsync();

        return Ok(orders);
    }

    // GET: api/orders/revenue-chart
    [HttpGet("revenue-chart")]
    public async Task<ActionResult> GetRevenueChart([FromQuery] int days = 30)
    {
        var startDate = DateTime.UtcNow.AddDays(-days);

        var data = await _context.Orders
            .Where(o => o.OrderDate >= startDate && o.PaymentStatus == "Paid")
            .GroupBy(o => o.OrderDate.Date)
            .Select(g => new
            {
                date = g.Key,
                revenue = g.Sum(o => o.TotalAmount),
                count = g.Count()
            })
            .OrderBy(x => x.date)
            .ToListAsync();

        return Ok(data);
    }

    // DELETE: api/orders/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.OrderItems)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class UpdateStatusRequest
{
    public string Status { get; set; } = string.Empty;
}

public class UpdatePaymentStatusRequest
{
    public string PaymentStatus { get; set; } = string.Empty;
}

public class UpdateNotesRequest
{
    public string? Notes { get; set; }
}
