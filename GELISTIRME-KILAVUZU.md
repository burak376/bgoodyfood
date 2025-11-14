# BGoody Food - Geliştirme Kılavuzu

Bu dosya, C# ve .NET ile rahat çalışan geliştiriciler için hazırlanmıştır.

## Başlangıç

### İlk Kurulum (Sadece Bir Kez)

1. **Backend Kurulumu:**
```bash
cd backend
dotnet restore
```

2. **Frontend Kurulumu:**
```bash
cd frontend
npm install
```

3. **Veritabanı Ayarları:**

`backend/appsettings.json` dosyasını açın ve Supabase şifrenizi ekleyin:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.aotmfmixngkuglekhzbw.supabase.co;Database=postgres;Username=postgres;Password=BURAYA_SIFRENIZI_YAZIN;Port=5432;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

4. **Migration'ları Çalıştırın:**
```bash
cd backend
dotnet ef database update
```

### Günlük Çalışma

Her gün iki terminal açın:

**Terminal 1 - Backend:**
```bash
./start-backend.sh
# veya
cd backend && dotnet watch run
```

**Terminal 2 - Frontend:**
```bash
./start-frontend.sh
# veya
cd frontend && npm run dev
```

## Backend Geliştirme (.NET)

### Yeni API Endpoint Ekleme

1. **Controller Oluşturun:**

```csharp
// Controllers/MyController.cs
using Microsoft.AspNetCore.Mvc;

namespace BGoodyFood.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MyController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Hello" });
    }

    [HttpPost]
    public IActionResult Create([FromBody] MyDto dto)
    {
        // İş mantığınız
        return Ok(dto);
    }
}
```

2. **Test Edin:**
- Swagger UI: http://localhost:5000/swagger
- Postman kullanabilirsiniz

### Yeni Model Ekleme

1. **Model Oluşturun:**

```csharp
// Models/MyModel.cs
namespace BGoodyFood.API.Models;

public class MyModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
```

2. **DbContext'e Ekleyin:**

```csharp
// Data/BGoodyFoodDbContext.cs
public DbSet<MyModel> MyModels { get; set; }
```

3. **Migration Oluşturun:**

```bash
cd backend
dotnet ef migrations add AddMyModel
dotnet ef database update
```

### Service Katmanı Ekleme

```csharp
// Services/IMyService.cs
public interface IMyService
{
    Task<List<MyModel>> GetAllAsync();
}

// Services/MyService.cs
public class MyService : IMyService
{
    private readonly BGoodyFoodDbContext _context;

    public MyService(BGoodyFoodDbContext context)
    {
        _context = context;
    }

    public async Task<List<MyModel>> GetAllAsync()
    {
        return await _context.MyModels.ToListAsync();
    }
}
```

**Program.cs'e kaydedin:**
```csharp
builder.Services.AddScoped<IMyService, MyService>();
```

## Frontend Geliştirme (React)

### Yeni Sayfa Ekleme

1. **Component Oluşturun:**

```typescript
// frontend/src/pages/MyPage.tsx
import { useEffect, useState } from 'react';

export default function MyPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/mycontroller')
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h1>My Page</h1>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

2. **Route Ekleyin:**

```typescript
// frontend/src/App.tsx
import MyPage from './pages/MyPage';

// Router içinde:
<Route path="/mypage" element={<MyPage />} />
```

### API Çağrıları

**Axios ile (Önerilen):**

```typescript
// frontend/src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getProducts = () => api.get('/products');
export const getProduct = (id: number) => api.get(`/products/${id}`);
export const createProduct = (data: any) => api.post('/products', data);
```

**Kullanımı:**

```typescript
import { getProducts } from '../lib/api';

const { data } = await getProducts();
```

## Veritabanı İşlemleri

### Migration Komutları

```bash
# Yeni migration oluştur
dotnet ef migrations add MigrationAdi

# Migration'ı uygula
dotnet ef database update

# Son migration'ı geri al
dotnet ef migrations remove

# Migration listesi
dotnet ef migrations list
```

### Entity Framework Sorgular

```csharp
// Tümünü getir
var products = await _context.Products.ToListAsync();

// ID ile getir
var product = await _context.Products.FindAsync(id);

// Filtreleme
var filtered = await _context.Products
    .Where(p => p.Price > 100)
    .ToListAsync();

// Join
var withCategory = await _context.Products
    .Include(p => p.Category)
    .ToListAsync();

// Ekleme
_context.Products.Add(newProduct);
await _context.SaveChangesAsync();

// Güncelleme
product.Name = "Yeni İsim";
await _context.SaveChangesAsync();

// Silme
_context.Products.Remove(product);
await _context.SaveChangesAsync();
```

## Authentication (JWT)

### Giriş İşlemi

```csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto dto)
{
    var user = await _userManager.FindByEmailAsync(dto.Email);

    if (user == null || !await _userManager.CheckPasswordAsync(user, dto.Password))
        return Unauthorized();

    var token = GenerateJwtToken(user);
    return Ok(new { token });
}
```

### Protected Endpoint

```csharp
[Authorize]
[HttpGet("profile")]
public IActionResult GetProfile()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    // ...
}
```

### Frontend'de Token Kullanımı

```typescript
// Token kaydet
localStorage.setItem('token', token);

// API çağrısında kullan
axios.get('/api/profile', {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
```

## Debugging

### Backend Debug

**Visual Studio Code:**
1. F5 tuşuna basın
2. Breakpoint koyabilirsiniz
3. Variables penceresi ile inceleyebilirsiniz

**Konsol:**
```csharp
Console.WriteLine($"Product: {product.Name}");
```

### Frontend Debug

**Browser DevTools:**
- Console: `console.log(data)`
- Network tab: API çağrılarını görün
- React DevTools: Component yapısını inceleyin

## Yaygın Hatalar ve Çözümler

### 1. CORS Hatası

**Hata:** "Access to fetch blocked by CORS policy"

**Çözüm:** `backend/Program.cs` dosyasında CORS zaten açık. Frontend URL'ini kontrol edin.

### 2. Migration Hatası

**Hata:** "Build failed"

**Çözüm:**
```bash
dotnet build
# Hataları düzeltin
dotnet ef migrations add FixMigration
```

### 3. Veritabanı Bağlantı Hatası

**Hata:** "Connection refused"

**Çözüm:**
- Supabase şifrenizi kontrol edin
- İnternet bağlantınızı kontrol edin
- Supabase Dashboard'da veritabanının çalıştığını doğrulayın

### 4. Frontend API Bağlantı Hatası

**Hata:** "Failed to fetch"

**Çözüm:**
- Backend çalışıyor mu: http://localhost:5000/swagger
- URL doğru mu: `http://localhost:5000/api/...`

## Best Practices

### Backend
- Her işlem için ayrı Service sınıfı kullanın
- DTO (Data Transfer Objects) kullanın
- Try-catch blokları kullanın
- Async/await kullanın
- Log kayıtları tutun (Serilog)

### Frontend
- Component'leri küçük tutun
- Custom hook'lar yazın
- TypeScript kullanın
- Error boundary kullanın
- Loading state'leri gösterin

## Daha Fazla Kaynak

- [ASP.NET Core Docs](https://docs.microsoft.com/aspnet/core)
- [Entity Framework Core](https://docs.microsoft.com/ef/core)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Supabase Docs](https://supabase.com/docs)
