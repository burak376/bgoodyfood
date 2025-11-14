# BGoody Food - E-Ticaret Projesi

Bu proje **backend (.NET)** ve **frontend (React)** olarak ayrı klasörlerde organize edilmiştir.

## Proje Yapısı

```
bgoodyfood/
├── backend/              # .NET 8 Web API - Müşteri API (Port: 5000)
│   ├── Controllers/      # API endpoint'leri
│   ├── Models/          # Veritabanı modelleri
│   ├── Services/        # İş mantığı
│   ├── Data/            # DbContext ve migration'lar
│   └── Program.cs       # Uygulama başlangıcı
│
├── frontend/            # React + Vite - Müşteri Arayüzü (Port: 5173)
│   ├── src/
│   │   ├── components/  # React bileşenleri
│   │   ├── pages/       # Sayfa componentleri
│   │   ├── hooks/       # Custom React hooks
│   │   ├── stores/      # State management (Zustand)
│   │   └── lib/         # Yardımcı fonksiyonlar
│   └── public/          # Statik dosyalar
│
└── backoffice/          # Admin Paneli (Bağımsız Uygulama)
    ├── backend/         # .NET 8 Web API - Admin API (Port: 5001)
    │   ├── Controllers/ # Admin endpoint'leri
    │   ├── Models/      # Admin modelleri
    │   └── Data/        # Admin DbContext
    └── frontend/        # React - Admin UI (Port: 3000)
        ├── src/
        │   ├── components/ # Admin bileşenleri
        │   ├── contexts/   # Auth context
        │   └── pages/      # Admin sayfaları
        └── package.json
```

## Teknolojiler

### Backend (.NET 8)
- **Framework:** ASP.NET Core Web API
- **Veritabanı:** PostgreSQL (Supabase)
- **ORM:** Entity Framework Core
- **Authentication:** JWT + Identity
- **Logging:** Serilog
- **API Docs:** Swagger/OpenAPI

### Frontend (React)
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **State:** Zustand
- **HTTP Client:** Axios

## Kurulum

### 1. Gereksinimler

- .NET 8 SDK
- Node.js 18+ ve npm
- PostgreSQL (Supabase hesabı)

### 2. Backend Kurulumu

```bash
cd backend

# Paketleri yükle
dotnet restore

# Supabase bağlantı bilgilerini düzenle
# appsettings.json dosyasındaki şu satırı düzenleyin:
# "DefaultConnection": "Host=db.aotmfmixngkuglekhzbw.supabase.co;Database=postgres;Username=postgres;Password=SUPABASE_SIFRENIZ;Port=5432;SSL Mode=Require;Trust Server Certificate=true"

# Migration'ları çalıştır
dotnet ef database update

# Uygulamayı başlat
dotnet run
```

Backend şu adreste çalışacak: `http://localhost:5000`
Swagger UI: `http://localhost:5000/swagger`

### 3. Frontend Kurulumu

```bash
cd frontend

# Paketleri yükle
npm install

# .env dosyası oluştur (isteğe bağlı)
# VITE_API_URL=http://localhost:5000/api

# Development server'ı başlat
npm run dev
```

Frontend şu adreste çalışacak: `http://localhost:5173`

## Backoffice (Admin Paneli)

Backoffice bağımsız bir uygulamadır. Detaylı bilgi için: `backoffice/KURULUM.md`

**Hızlı Başlangıç:**
```bash
# Terminal 1
cd backoffice
./start-backend.sh

# Terminal 2
cd backoffice
./start-frontend.sh
```

- Admin Panel: http://localhost:3000
- Admin API: http://localhost:5001/swagger
- Giriş: admin / admin123

## Kullanım

### Backend API Endpoint'leri

**Swagger UI'dan tüm endpoint'leri görebilirsiniz:**
http://localhost:5000/swagger

Başlıca endpoint'ler:

```
GET    /api/categories          # Tüm kategoriler
GET    /api/categories/{id}     # Kategori detayı
POST   /api/categories          # Yeni kategori

GET    /api/products            # Tüm ürünler
GET    /api/products/{id}       # Ürün detayı
POST   /api/products            # Yeni ürün
PUT    /api/products/{id}       # Ürün güncelle
DELETE /api/products/{id}       # Ürün sil

POST   /api/auth/register       # Kullanıcı kaydı
POST   /api/auth/login          # Giriş yap
```

### Frontend'den Backend'e Bağlanma

Frontend'de API çağrıları için `axios` kullanılıyor:

```typescript
// src/lib/api.ts örneği
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token ile çağrı
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Veritabanı Migration'ları

Yeni migration oluşturma:

```bash
cd backend
dotnet ef migrations add MigrationAdi
dotnet ef database update
```

## Development Workflow

### Günlük Geliştirme

**Terminal 1 - Backend:**
```bash
cd backend
dotnet watch run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Her iki uygulama da otomatik olarak yeniden yüklenecek (hot reload).

## Veritabanı Yapısı

### Ana Tablolar

**Categories** - Ürün kategorileri
- Id (int, PK)
- Name (string)
- Slug (string, unique)
- Description (string)
- IconUrl (string)
- Gradient (string)

**Products** - Ürünler
- Id (int, PK)
- Name (string)
- Description (string)
- Price (decimal)
- CategoryId (int, FK)
- ImageUrl (string)
- Stock (int)
- Rating (decimal)

**AspNetUsers** - Kullanıcılar (Identity)
- Id (string, PK)
- UserName (string)
- Email (string)
- PasswordHash (string)

**Orders** - Siparişler
- Id (int, PK)
- UserId (string, FK)
- OrderNumber (string)
- Status (string)
- TotalAmount (decimal)
- CreatedAt (datetime)

## Supabase Bağlantısı

Projeniz **Supabase PostgreSQL** kullanıyor.

### Bağlantı Bilgileri

`.env` dosyanızda (root directory):
```
NEXT_PUBLIC_SUPABASE_URL=https://aotmfmixngkuglekhzbw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

`backend/appsettings.json` dosyanızda:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=db.aotmfmixngkuglekhzbw.supabase.co;Database=postgres;Username=postgres;Password=YOUR_PASSWORD;Port=5432;SSL Mode=Require;Trust Server Certificate=true"
  }
}
```

**NOT:** Supabase şifrenizi Supabase Dashboard > Settings > Database sayfasından alabilirsiniz.

## Production Build

### Backend Build
```bash
cd backend
dotnet publish -c Release -o ./publish
```

### Frontend Build
```bash
cd frontend
npm run build
# Build çıktısı: frontend/dist/
```

## Sorun Giderme

### Backend başlamıyor
- .NET 8 SDK kurulu mu kontrol edin: `dotnet --version`
- Supabase bağlantı bilgilerini kontrol edin
- Migration'lar çalıştırıldı mı: `dotnet ef database update`

### Frontend API'ye bağlanamıyor
- Backend çalışıyor mu kontrol edin: `http://localhost:5000/swagger`
- CORS ayarları doğru mu (backend Program.cs)
- Browser console'da hata var mı kontrol edin

### CORS Hatası
Backend'de CORS zaten açık, ama sorun yaşarsanız:
```csharp
// Program.cs
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

## Yardım

Sorularınız için:
- Backend: .NET Core ve Entity Framework dokümantasyonu
- Frontend: React ve Vite dokümantasyonu
- Veritabanı: Supabase ve PostgreSQL dokümantasyonu

## Lisans

Bu proje özel bir projedir.
