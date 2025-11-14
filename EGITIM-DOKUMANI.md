# BGoodyFood - Tam Öğretici Eğitim Dokümanı

Bu doküman, projenin **React** ve **.NET** tarafını detaylıca açıklayan kapsamlı bir eğitim rehberidir.

---

## İçindekiler

1. [Proje Mimarisi](#proje-mimarisi)
2. [.NET Backend Eğitimi](#net-backend-eğitimi)
3. [React Frontend Eğitimi](#react-frontend-eğitimi)
4. [Veritabanı Yapısı](#veritabanı-yapısı)
5. [Authentication Flow](#authentication-flow)
6. [API Entegrasyonu](#api-entegrasyonu)
7. [Örneklerle Kod Açıklamaları](#örneklerle-kod-açıklamaları)

---

## Proje Mimarisi

### Genel Yapı

```
bgoodyfood/
│
├── backend/          # .NET 8 Web API
│   ├── Controllers/  # HTTP endpoint'leri
│   ├── Models/      # Veritabanı modelleri
│   ├── Services/    # İş mantığı
│   ├── Data/        # DbContext, veritabanı
│   └── Program.cs   # Uygulama yapılandırması
│
├── frontend/        # React + Vite
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React bileşenleri
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Yardımcı fonksiyonlar
│   │   └── stores/       # State management
│   └── public/      # Statik dosyalar
│
└── backoffice/      # Admin Paneli
    ├── backend/     # Admin API (.NET)
    └── frontend/    # Admin UI (React)
```

### Mimari Prensipler

1. **Separation of Concerns**: Backend ve Frontend tamamen ayrı
2. **RESTful API**: Backend sadece JSON API sağlar
3. **SPA (Single Page Application)**: Frontend tek sayfa uygulama
4. **JWT Authentication**: Token tabanlı kimlik doğrulama
5. **PostgreSQL (Supabase)**: Merkezi veritabanı

---

## .NET Backend Eğitimi

### 1. Program.cs - Uygulama Başlangıcı

`Program.cs`, uygulamanın başlangıç noktasıdır. Tüm servisler ve middleware'ler burada yapılandırılır.

```csharp
using Microsoft.EntityFrameworkCore;
using BGoodyFood.API.Data;
using BGoodyFood.API.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Controller'ları ekle
builder.Services.AddControllers();

// 2. Veritabanı bağlantısı (PostgreSQL/Supabase)
builder.Services.AddDbContext<BGoodyFoodDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 3. CORS (Frontend'in backend'e erişimi için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")  // Vite frontend
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 4. Dependency Injection (Servisler)
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

// 5. Swagger (API dokümantasyonu)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 6. Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();
```

**Açıklama:**
- `builder.Services`: Servisleri kaydet (Dependency Injection Container)
- `AddDbContext`: Entity Framework Core için veritabanı bağlantısı
- `AddCors`: Cross-Origin Resource Sharing (Frontend-Backend iletişimi)
- `app.Use...`: Request pipeline (her HTTP isteği bu sırayla işlenir)

---

### 2. Models - Veritabanı Modelleri

Models, veritabanındaki tabloları temsil eden C# sınıflarıdır.

**Product.cs**
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BGoodyFood.API.Models;

public class Product
{
    // Primary Key (otomatik artan ID)
    public int Id { get; set; }

    // Required: Zorunlu alan (NULL olamaz)
    [Required]
    [MaxLength(200)]  // Maksimum 200 karakter
    public string Name { get; set; } = string.Empty;

    // Nullable: ? işareti ile opsiyonel yapılır
    [MaxLength(1000)]
    public string? Description { get; set; }

    // Decimal: Para birimi için
    [Column(TypeName = "decimal(10,2)")]  // 10 basamak, 2 ondalık
    public decimal Price { get; set; }

    // Foreign Key: İlişkili tablo
    public int CategoryId { get; set; }

    // Navigation Property: İlişkili nesne
    public virtual Category Category { get; set; } = null!;

    // Boolean: Doğru/Yanlış
    public bool IsOrganic { get; set; } = false;

    // DateTime: Tarih/Zaman
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

**Açıklama:**
- `[Required]`: Bu alan NULL olamaz (veritabanı constraint'i)
- `[MaxLength]`: Maksimum karakter sayısı
- `decimal(10,2)`: 12345678.90 formatında (10 basamak, 2 ondalık)
- `virtual`: Lazy loading için (ihtiyaç duyulduğunda yüklenir)
- `= string.Empty`: Default değer

---

### 3. DbContext - Veritabanı Bağlantısı

DbContext, Entity Framework Core'un veritabanı ile konuşan ana sınıfıdır.

**BGoodyFoodDbContext.cs**
```csharp
using Microsoft.EntityFrameworkCore;
using BGoodyFood.API.Models;

namespace BGoodyFood.API.Data;

public class BGoodyFoodDbContext : DbContext
{
    public BGoodyFoodDbContext(DbContextOptions<BGoodyFoodDbContext> options)
        : base(options)
    {
    }

    // DbSet: Her tablo için bir DbSet
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    // Model yapılandırması
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Product yapılandırması
        modelBuilder.Entity<Product>(entity =>
        {
            // Primary Key
            entity.HasKey(e => e.Id);

            // Index (hızlı arama için)
            entity.HasIndex(e => e.Name);

            // Foreign Key ilişkisi
            entity.HasOne(e => e.Category)        // Product'ın bir Category'si var
                  .WithMany(c => c.Products)      // Category'nin birçok Product'ı var
                  .HasForeignKey(e => e.CategoryId) // Foreign Key
                  .OnDelete(DeleteBehavior.Restrict); // Category silinirse ne olsun?

            // Decimal precision
            entity.Property(e => e.Price)
                  .HasPrecision(10, 2);
        });

        // Seed Data (başlangıç verileri)
        modelBuilder.Entity<Category>().HasData(
            new Category { Id = 1, Name = "Fruits" },
            new Category { Id = 2, Name = "Vegetables" }
        );
    }
}
```

**Açıklama:**
- `DbSet<T>`: Veritabanındaki tablo
- `HasKey`: Primary key tanımla
- `HasIndex`: Index oluştur (arama performansı için)
- `HasOne/WithMany`: İlişki tanımla (1-to-many)
- `OnDelete`: Silme davranışı
  - `Cascade`: Ana kayıt silinirse ilişkili kayıtlar da silinir
  - `Restrict`: Ana kayıt silinmez (ilişkili kayıt varsa)
  - `SetNull`: Foreign Key NULL yapılır

---

### 4. Controllers - API Endpoint'leri

Controller'lar HTTP isteklerini karşılar ve cevap döner.

**ProductsController.cs**
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BGoodyFood.API.Data;
using BGoodyFood.API.Models;

namespace BGoodyFood.API.Controllers;

// API Controller attribute'ları
[ApiController]                    // Bu bir API controller'ı
[Route("api/[controller]")]        // Route: api/products

public class ProductsController : ControllerBase
{
    private readonly BGoodyFoodDbContext _context;

    // Dependency Injection ile DbContext alınır
    public ProductsController(BGoodyFoodDbContext context)
    {
        _context = context;
    }

    // GET: api/products
    [HttpGet]  // HTTP GET metodu
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        // Tüm ürünleri getir (asenkron)
        var products = await _context.Products
            .Include(p => p.Category)  // Category'yi de dahil et (JOIN)
            .ToListAsync();            // Listeye çevir

        return Ok(products);  // 200 OK + JSON data
    }

    // GET: api/products/5
    [HttpGet("{id}")]  // Route parameter
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);  // WHERE Id = id

        if (product == null)
        {
            return NotFound(new { message = "Product not found" });  // 404
        }

        return Ok(product);  // 200 OK
    }

    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        // Model validation (Required, MaxLength vs.)
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);  // 400 Bad Request
        }

        // Yeni ürün ekle
        _context.Products.Add(product);
        await _context.SaveChangesAsync();  // INSERT INTO products...

        // 201 Created + Location header + JSON data
        return CreatedAtAction(
            nameof(GetProduct),           // Action adı
            new { id = product.Id },      // Route parametresi
            product                       // Response body
        );
    }

    // PUT: api/products/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, Product product)
    {
        if (id != product.Id)
        {
            return BadRequest();  // ID uyuşmuyor
        }

        // Mevcut ürünü bul
        var existingProduct = await _context.Products.FindAsync(id);
        if (existingProduct == null)
        {
            return NotFound();
        }

        // Güncelle
        existingProduct.Name = product.Name;
        existingProduct.Price = product.Price;
        existingProduct.Description = product.Description;
        // ... diğer alanlar

        await _context.SaveChangesAsync();  // UPDATE products...

        return NoContent();  // 204 No Content
    }

    // DELETE: api/products/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            return NotFound();
        }

        _context.Products.Remove(product);
        await _context.SaveChangesAsync();  // DELETE FROM products...

        return NoContent();  // 204 No Content
    }
}
```

**HTTP Status Codes:**
- `200 OK`: Başarılı
- `201 Created`: Yeni kayıt oluşturuldu
- `204 No Content`: Başarılı ama dönecek data yok
- `400 Bad Request`: Hatalı istek
- `404 Not Found`: Bulunamadı
- `500 Internal Server Error`: Sunucu hatası

---

### 5. Services - İş Mantığı

Service'ler, Controller'ları hafifletir ve iş mantığını kapsar.

**IProductService.cs (Interface)**
```csharp
namespace BGoodyFood.API.Services;

public interface IProductService
{
    Task<IEnumerable<Product>> GetAllProductsAsync();
    Task<Product?> GetProductByIdAsync(int id);
    Task<Product> CreateProductAsync(Product product);
    Task UpdateProductAsync(Product product);
    Task DeleteProductAsync(int id);
    Task<bool> ProductExistsAsync(int id);
}
```

**ProductService.cs (Implementation)**
```csharp
using Microsoft.EntityFrameworkCore;
using BGoodyFood.API.Data;
using BGoodyFood.API.Models;

namespace BGoodyFood.API.Services;

public class ProductService : IProductService
{
    private readonly BGoodyFoodDbContext _context;

    public ProductService(BGoodyFoodDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        return await _context.Products
            .Include(p => p.Category)
            .Where(p => p.IsActive)  // Sadece aktif ürünler
            .OrderBy(p => p.Name)
            .ToListAsync();
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        return await _context.Products
            .Include(p => p.Category)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        // İş mantığı
        product.CreatedAt = DateTime.UtcNow;
        product.IsActive = true;

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return product;
    }

    public async Task UpdateProductAsync(Product product)
    {
        product.UpdatedAt = DateTime.UtcNow;

        _context.Entry(product).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product != null)
        {
            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<bool> ProductExistsAsync(int id)
    {
        return await _context.Products.AnyAsync(p => p.Id == id);
    }
}
```

**Controller'da Service Kullanımı:**
```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;

    public ProductsController(IProductService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        var products = await _productService.GetAllProductsAsync();
        return Ok(products);
    }
}
```

**Neden Service Pattern?**
- Controller'lar sadece HTTP işlerine odaklanır
- İş mantığı tekrar kullanılabilir
- Test edilebilir (mock'lanabilir)
- Kod daha temiz ve okunabilir

---

### 6. Migrations - Veritabanı Sürüm Kontrolü

Migration'lar, veritabanı şemasındaki değişiklikleri kod olarak tutar.

**Migration Oluşturma:**
```bash
dotnet ef migrations add InitialCreate
```

**Migration Dosyası:**
```csharp
public partial class InitialCreate : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        // Tablo oluştur
        migrationBuilder.CreateTable(
            name: "Products",
            columns: table => new
            {
                Id = table.Column<int>(nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy",
                                NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                Name = table.Column<string>(maxLength: 200, nullable: false),
                Price = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                CategoryId = table.Column<int>(nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Products", x => x.Id);
                table.ForeignKey(
                    name: "FK_Products_Categories_CategoryId",
                    column: x => x.CategoryId,
                    principalTable: "Categories",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Restrict);
            });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
        // Tabloyu sil (rollback için)
        migrationBuilder.DropTable(name: "Products");
    }
}
```

**Migration Uygulama:**
```bash
# Veritabanına uygula
dotnet ef database update

# Belirli bir migration'a dön
dotnet ef database update InitialCreate

# Son migration'ı geri al
dotnet ef migrations remove
```

---

## React Frontend Eğitimi

### 1. Next.js App Router

Next.js 13+ App Router kullanıyoruz. Sayfa yapısı:

```
src/app/
├── page.tsx          → Ana sayfa (/)
├── layout.tsx        → Root layout (tüm sayfalar için)
├── globals.css       → Global CSS
│
├── products/
│   └── page.tsx      → /products
│
├── cart/
│   └── page.tsx      → /cart
│
└── api/              → API route'lar (backend proxy)
    ├── products/
    │   └── route.ts  → /api/products
    └── cart/
        └── route.ts  → /api/cart
```

**layout.tsx (Root Layout)**
```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BGoodyFood - Organic Food Store",
  description: "Fresh organic products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <nav>
          {/* Navigation */}
        </nav>
        <main>{children}</main>
        <footer>
          {/* Footer */}
        </footer>
      </body>
    </html>
  );
}
```

**page.tsx (Ana Sayfa)**
```tsx
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to BGoodyFood</h1>
      <p>Fresh organic products</p>
    </div>
  );
}
```

---

### 2. React Components

**Fonksiyonel Component Yapısı:**
```tsx
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
  onAddToCart: (id: number) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // State: Component'in kendi verisi
  const [quantity, setQuantity] = useState(1);

  // Effect: Component mount olduğunda çalışır
  useEffect(() => {
    console.log('ProductCard mounted');

    // Cleanup (component unmount olduğunda)
    return () => {
      console.log('ProductCard unmounted');
    };
  }, []); // Boş array = sadece mount/unmount'da çalış

  // Effect: quantity değiştiğinde çalışır
  useEffect(() => {
    console.log('Quantity changed:', quantity);
  }, [quantity]); // dependency array

  // Event Handler
  const handleAddToCart = () => {
    onAddToCart(product.id);
  };

  // Render
  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>

      <div>
        <button onClick={() => setQuantity(quantity - 1)}>-</button>
        <span>{quantity}</span>
        <button onClick={() => setQuantity(quantity + 1)}>+</button>
      </div>

      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}
```

**Component Kullanımı:**
```tsx
import ProductCard from '@/components/ProductCard';

export default function ProductsPage() {
  const products = [
    { id: 1, name: "Apple", price: 2.99, imageUrl: "/apple.jpg" },
    { id: 2, name: "Banana", price: 1.99, imageUrl: "/banana.jpg" },
  ];

  const handleAddToCart = (id: number) => {
    console.log('Add to cart:', id);
  };

  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={handleAddToCart}
        />
      ))}
    </div>
  );
}
```

---

### 3. Custom Hooks

Custom hook'lar, React logic'ini tekrar kullanılabilir hale getirir.

**useCart.ts**
```tsx
import { useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export function useCart() {
  // State
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // LocalStorage'dan yükle
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Sepete ekle
  const addItem = (product: { id: number; name: string; price: number }) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);

      if (existingItem) {
        // Mevcut ürünün miktarını artır
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Yeni ürün ekle
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Sepetten çıkar
  const removeItem = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // Miktarı güncelle
  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
    } else {
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Toplam fiyat
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Toplam ürün sayısı
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Return: Hook'un döndürdüğü değerler
  return {
    items,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    total,
    itemCount,
  };
}
```

**Hook Kullanımı:**
```tsx
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCart();

  return (
    <div>
      <h1>Shopping Cart</h1>

      {items.map(item => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>${item.price}</p>

          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          />

          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}

      <div>Total: ${total.toFixed(2)}</div>
    </div>
  );
}
```

---

### 4. State Management - Zustand

Zustand, basit ve güçlü bir state management kütüphanesidir.

**cart-store.ts**
```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: { id: number; name: string; price: number }) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);

          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [...state.items, { ...product, quantity: 1 }],
            };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
        } else {
          set((state) => ({
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity } : item
            ),
          }));
        }
      },

      clearCart: () => set({ items: [] }),

      total: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      itemCount: () => {
        const state = get();
        return state.items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // LocalStorage key
    }
  )
);
```

**Store Kullanımı:**
```tsx
import { useCartStore } from '@/stores/cart-store';

export default function ProductCard({ product }) {
  // Store'dan sadece ihtiyacınız olan şeyleri alın
  const addItem = useCartStore((state) => state.addItem);
  const itemCount = useCartStore((state) => state.itemCount());

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => addItem(product)}>Add to Cart</button>
      <div>Cart: {itemCount} items</div>
    </div>
  );
}
```

---

### 5. API Çağrıları

**Axios ile API İsteği:**
```tsx
import axios from 'axios';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

**React Query ile (Önerilen):**
```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Fetch hook
function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/products`);
      return data;
    },
  });
}

// Mutation hook (POST, PUT, DELETE)
function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct) => {
      const { data } = await axios.post(`${API_URL}/products`, newProduct);
      return data;
    },
    onSuccess: () => {
      // Cache'i yenile
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Component
export default function ProductsPage() {
  const { data: products, isLoading, error } = useProducts();
  const createProduct = useCreateProduct();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCreate = () => {
    createProduct.mutate({
      name: 'New Product',
      price: 9.99,
    });
  };

  return (
    <div>
      <button onClick={handleCreate}>Create Product</button>

      {products?.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## Veritabanı Yapısı

### Entity İlişkileri

```
Categories (1) ─────< (N) Products
                            │
                            │ (N)
                            ↓
                         OrderItems ───< (N) Orders
                            │
                            │ (N)
                            ↓
                         (1) Product
```

**İlişki Türleri:**

1. **One-to-Many (1-N)**: Bir Category'nin birçok Product'ı var
```csharp
public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }

    // Navigation property
    public virtual ICollection<Product> Products { get; set; }
}

public class Product
{
    public int Id { get; set; }
    public int CategoryId { get; set; }  // Foreign Key

    // Navigation property
    public virtual Category Category { get; set; }
}
```

2. **Many-to-Many (N-N)**: OrderItems üzerinden Product-Order ilişkisi
```csharp
public class Order
{
    public int Id { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; }
}

public class OrderItem  // Junction table
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }

    public virtual Order Order { get; set; }
    public virtual Product Product { get; set; }
}
```

---

## Authentication Flow

### JWT Token Akışı

```
1. Login Request
   Frontend → Backend: POST /api/auth/login { username, password }

2. Token Generation
   Backend: Validate credentials → Generate JWT → Return token

3. Store Token
   Frontend: Save token to localStorage/cookie

4. Authenticated Requests
   Frontend → Backend: GET /api/products
   Headers: { Authorization: "Bearer <token>" }

5. Token Validation
   Backend: Validate token → Execute request → Return data
```

**Backend - Token Oluşturma:**
```csharp
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

public string GenerateToken(AdminUser user)
{
    var claims = new[]
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.Username),
        new Claim(ClaimTypes.Email, user.Email),
    };

    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var token = new JwtSecurityToken(
        issuer: "BGoodyFood",
        audience: "BGoodyFood.Admin",
        claims: claims,
        expires: DateTime.UtcNow.AddHours(1),
        signingCredentials: creds
    );

    return new JwtSecurityTokenHandler().WriteToken(token);
}
```

**Frontend - Token Kullanımı:**
```tsx
import axios from 'axios';

// Login
const login = async (username: string, password: string) => {
  const response = await axios.post('/api/auth/login', {
    username,
    password,
  });

  const token = response.data.token;
  localStorage.setItem('token', token);

  return token;
};

// Authenticated request
const fetchProducts = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get('/api/products', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// Axios interceptor (otomatik token ekleme)
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## API Entegrasyonu

### Backend API ↔ Frontend Communication

**1. REST API Conventions:**
```
GET    /api/products       → Tüm ürünleri listele
GET    /api/products/5     → ID=5 ürünü getir
POST   /api/products       → Yeni ürün oluştur
PUT    /api/products/5     → ID=5 ürünü güncelle
DELETE /api/products/5     → ID=5 ürünü sil
```

**2. Request/Response Format:**
```typescript
// Request (Frontend)
const response = await fetch('http://localhost:5000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Apple',
    price: 2.99,
    categoryId: 1,
  }),
});

// Response (Backend)
{
  "id": 10,
  "name": "Apple",
  "price": 2.99,
  "categoryId": 1,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**3. Error Handling:**
```typescript
try {
  const response = await axios.post('/api/products', product);
  console.log('Success:', response.data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Backend error response
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // No response received
      console.error('No response from server');
    } else {
      // Request setup error
      console.error('Error:', error.message);
    }
  }
}
```

---

## Örneklerle Kod Açıklamaları

### Örnek 1: Ürün Ekleme (End-to-End)

**Frontend - ProductForm.tsx:**
```tsx
'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    categoryId: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:5000/api/products',
        formData
      );

      alert('Product created: ' + response.data.name);
    } catch (error) {
      alert('Error creating product');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />

      <input
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
      />

      <button type="submit">Create Product</button>
    </form>
  );
}
```

**Backend - ProductsController.cs:**
```csharp
[HttpPost]
public async Task<ActionResult<Product>> CreateProduct(Product product)
{
    // 1. Validation
    if (string.IsNullOrWhiteSpace(product.Name))
    {
        return BadRequest(new { message = "Name is required" });
    }

    // 2. Business logic
    product.CreatedAt = DateTime.UtcNow;
    product.IsActive = true;

    // 3. Save to database
    _context.Products.Add(product);
    await _context.SaveChangesAsync();

    // 4. Return response
    return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
}
```

**İstek Akışı:**
1. Kullanıcı formu doldurur
2. `handleSubmit` çalışır
3. Axios POST isteği atar
4. .NET Controller isteği alır
5. Validation yapar
6. Veritabanına kayıt atar
7. Response döner (201 Created)
8. Frontend alert gösterir

---

### Örnek 2: Sepet Yönetimi

**Zustand Store:**
```tsx
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find(i => i.id === product.id);

          if (existing) {
            // Miktarı artır
            return {
              items: state.items.map(i =>
                i.id === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }

          // Yeni ürün ekle
          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        });
      },
    }),
    { name: 'cart' }
  )
);
```

**Component:**
```tsx
export default function ProductCard({ product }) {
  const addItem = useCartStore(state => state.addItem);

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => addItem(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default function CartSummary() {
  const itemCount = useCartStore(state => state.itemCount());
  const total = useCartStore(state => state.total());

  return (
    <div>
      <span>{itemCount} items</span>
      <span>${total.toFixed(2)}</span>
    </div>
  );
}
```

---

## Sonuç

Bu doküman, projenin tüm katmanlarını detaylıca açıklamaktadır:

**Backend (.NET):**
- ✅ Program.cs yapılandırması
- ✅ Models ve Entity Framework
- ✅ Controllers ve HTTP metodları
- ✅ Services ve Dependency Injection
- ✅ Migrations ve veritabanı

**Frontend (React):**
- ✅ Next.js App Router
- ✅ Components ve Props
- ✅ Hooks (useState, useEffect, custom hooks)
- ✅ State Management (Zustand)
- ✅ API çağrıları (Axios, React Query)

**Entegrasyon:**
- ✅ REST API communication
- ✅ JWT Authentication
- ✅ Error handling
- ✅ End-to-end örnekler

**Öğrenme Yolu:**
1. Backend'den başlayın (.NET temellerini öğrenin)
2. Models ve DbContext'i anlayın
3. Controller'lar yazın
4. Frontend'e geçin (React temellerini öğrenin)
5. Components ve Hooks'u pratik yapın
6. API entegrasyonunu tamamlayın

Her bölüm için kod örnekleri ve açıklamalar verilmiştir. Pratik yapmak için:
- Swagger'dan API'leri test edin
- Küçük componentler yazın
- Custom hook'lar oluşturun
- Kendi özelliklerinizi ekleyin

**İyi öğrenmeler!** 🚀
