# Backoffice (Admin Paneli) - Kurulum Kılavuzu

Bu klasör **admin paneli** için ayrılmış bağımsız bir uygulamadır.

## Yapı

```
backoffice/
├── backend/              # .NET 8 Web API (Admin API)
│   ├── Controllers/      # Admin endpoint'leri
│   ├── Models/          # Admin veritabanı modelleri
│   ├── Data/            # DbContext ve Seed
│   └── Program.cs       # Admin API başlangıç
│
├── frontend/            # React Admin Panel (Material-UI)
│   ├── src/
│   │   ├── components/  # UI bileşenleri
│   │   ├── contexts/    # Auth context
│   │   ├── pages/       # Admin sayfaları
│   │   └── App.tsx      # Ana uygulama
│   └── package.json
│
├── start-backend.sh     # Backend başlatma script'i
└── start-frontend.sh    # Frontend başlatma script'i
```

## Özellikler

### Backend (.NET 8)
- **Port:** 5001
- **Veritabanı:** PostgreSQL (Supabase)
- **Auth:** JWT
- **API Docs:** Swagger

### Frontend (React 18)
- **Port:** 3000
- **UI:** Material-UI (MUI)
- **Routing:** React Router
- **HTTP:** Axios

## Hızlı Başlangıç

### İlk Kurulum

**1. Backend Kurulumu:**
```bash
cd backoffice/backend

# Supabase şifresini ekleyin
# appsettings.json dosyasını düzenleyin
nano appsettings.json

# Paketleri yükle
dotnet restore

# Migration çalıştır
dotnet ef database update
```

**2. Frontend Kurulumu:**
```bash
cd backoffice/frontend

# Paketleri yükle
npm install
```

### Çalıştırma

İki terminal açın:

**Terminal 1 - Backend:**
```bash
cd backoffice
./start-backend.sh
```
veya
```bash
cd backoffice/backend
dotnet watch run --urls="http://localhost:5001"
```

**Terminal 2 - Frontend:**
```bash
cd backoffice
./start-frontend.sh
```
veya
```bash
cd backoffice/frontend
npm start
```

## URL'ler

- **Frontend (Admin Panel):** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **Swagger:** http://localhost:5001/swagger

## Varsayılan Giriş Bilgileri

```
Kullanıcı Adı: admin
Şifre: admin123
```

## API Endpoint'leri

### Kimlik Doğrulama
- `POST /api/auth/login` - Admin girişi
- `POST /api/auth/register` - Yeni admin kaydı
- `POST /api/auth/change-password` - Şifre değiştir

### Ürün Yönetimi
- `GET /api/products` - Tüm ürünler
- `GET /api/products/{id}` - Ürün detayı
- `POST /api/products` - Yeni ürün
- `PUT /api/products/{id}` - Ürün güncelle
- `DELETE /api/products/{id}` - Ürün sil

### Sipariş Yönetimi
- `GET /api/orders` - Tüm siparişler
- `GET /api/orders/{id}` - Sipariş detayı
- `PUT /api/orders/{id}/status` - Sipariş durumu güncelle

### Kullanıcı Yönetimi
- `GET /api/users` - Tüm kullanıcılar
- `GET /api/users/{id}` - Kullanıcı detayı
- `PUT /api/users/{id}` - Kullanıcı güncelle
- `DELETE /api/users/{id}` - Kullanıcı sil

## Veritabanı

### Tablolar

**AdminUsers** - Admin kullanıcılar
- Id (int)
- Username (string, unique)
- Email (string, unique)
- PasswordHash (string)
- FullName (string)
- IsActive (bool)
- CreatedAt (datetime)

**Products** - Ürünler (Admin tarafından yönetilen)
- Id (int)
- Name (string)
- Description (string)
- Price (decimal)
- OriginalPrice (decimal)
- Stock (int)
- CategoryId (int)
- IsOrganic (bool)
- IsFeatured (bool)
- CreatedBy (int) - AdminUser FK
- UpdatedBy (int) - AdminUser FK

**Orders** - Siparişler
- Id (int)
- OrderNumber (string, unique)
- CustomerName (string)
- CustomerEmail (string)
- Status (string)
- TotalAmount (decimal)
- CreatedAt (datetime)

**OrderItems** - Sipariş detayları
- Id (int)
- OrderId (int) - FK
- ProductId (int) - FK
- Quantity (int)
- UnitPrice (decimal)
- TotalPrice (decimal)

### Migration Komutları

```bash
cd backoffice/backend

# Yeni migration
dotnet ef migrations add MigrationAdi

# Migration uygula
dotnet ef database update

# Migration geri al
dotnet ef migrations remove
```

## Frontend Yapısı

### Ana Sayfalar

**Dashboard** (`/`)
- Toplam ürün sayısı
- Toplam sipariş sayısı
- Aktif kullanıcı sayısı
- Günlük satış raporu

**Products** (`/products`)
- Ürün listesi (tablo)
- Ürün ekleme formu
- Ürün düzenleme
- Ürün silme

**Orders** (`/orders`)
- Sipariş listesi
- Sipariş detayları
- Durum güncelleme
- Filtreleme

**Users** (`/users`)
- Kullanıcı listesi
- Kullanıcı düzenleme
- Hesap aktif/pasif

**Login** (`/login`)
- Admin giriş formu
- JWT token alır

### Componentler

- `Layout.tsx` - Ana layout (navbar, sidebar)
- `ProtectedRoute.tsx` - Korumalı route wrapper
- `AuthContext.tsx` - Authentication state

## Geliştirme

### Yeni API Endpoint Eklemek

**1. Controller oluştur:**
```csharp
// Controllers/MyController.cs
[ApiController]
[Route("api/[controller]")]
public class MyController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { message = "Hello" });
    }
}
```

**2. Swagger'dan test et:**
http://localhost:5001/swagger

### Yeni Sayfa Eklemek (Frontend)

**1. Sayfa oluştur:**
```typescript
// src/pages/MyPage.tsx
import React from 'react';

export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
    </div>
  );
}
```

**2. Route ekle:**
```typescript
// src/App.tsx
import MyPage from './pages/MyPage';

// Router içinde:
<Route path="/mypage" element={
  <ProtectedRoute>
    <MyPage />
  </ProtectedRoute>
} />
```

## Önemli Notlar

1. **Backend port 5001** kullanır (Ana backend 5000 kullanır)
2. **Frontend port 3000** kullanır
3. **Supabase şifresini mutlaka ekleyin** (`appsettings.json`)
4. **Admin bilgileri seed data ile oluşturulur**
5. **JWT token 60 dakika geçerlidir**

## Sorun Giderme

### Backend başlamıyor
```bash
cd backoffice/backend
dotnet --version  # .NET 8 kurulu mu?
dotnet restore
dotnet build
```

### Frontend başlamıyor
```bash
cd backoffice/frontend
rm -rf node_modules
npm install
npm start
```

### CORS hatası
Backend'de zaten açık, ama sorun varsa:
```csharp
// Program.cs'de zaten var:
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

### Migration hatası
```bash
cd backoffice/backend
dotnet ef database drop --force
dotnet ef database update
```

## Ana Proje ile Fark

| Özellik | Ana Proje | Backoffice |
|---------|-----------|------------|
| Port (Backend) | 5000 | 5001 |
| Port (Frontend) | 5173 (Vite) | 3000 (CRA) |
| Kullanıcı | Müşteriler | Adminler |
| UI | Tailwind CSS | Material-UI |
| Auth | Normal kullanıcı | Admin JWT |
| Veritabanı | Aynı Supabase | Aynı Supabase |

## Deployment

### Backend
```bash
cd backoffice/backend
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd backoffice/frontend
npm run build
# Build: build/ klasörüne oluşur
```

## Daha Fazla Bilgi

Ana dokümantasyon: `README.md`
Ana proje kılavuzu: `../GELISTIRME-KILAVUZU.md`
