# BGoody Food - Proje Yapısı ve Özet

## Proje Durumu

Projeniz **backend** ve **frontend** olarak tamamen ayrılmış durumda.

```
bgoodyfood/
│
├── backend/              (.NET 8 - Müşteri API - Port: 5000)
│   ├── Controllers/      API endpoint'leri
│   ├── Models/          Veritabanı modelleri
│   ├── Services/        İş mantığı
│   ├── Data/            DbContext
│   └── Program.cs       Ana dosya
│
├── frontend/            (React + Vite - Müşteri UI - Port: 5173)
│   ├── src/
│   │   ├── components/  UI bileşenleri
│   │   ├── pages/       Sayfalar
│   │   └── lib/         Yardımcı fonksiyonlar
│   └── public/          Statik dosyalar
│
└── backoffice/          (Admin Paneli - Bağımsız Uygulama)
    ├── backend/         (.NET 8 - Admin API - Port: 5001)
    │   ├── Controllers/ Admin endpoint'leri
    │   ├── Models/      Admin modelleri
    │   └── Data/        Admin DbContext
    └── frontend/        (React - Admin UI - Port: 3000)
        ├── src/
        │   ├── components/ Admin bileşenleri
        │   ├── pages/      Admin sayfaları
        │   └── contexts/   Auth context
        └── package.json
```

## Sizin İçin Önemli Noktalar

### Backend (.NET) - Sizin Rahat Çalışacağınız Kısım

**Port:** `http://localhost:5000`
**Swagger:** `http://localhost:5000/swagger`
**Dil:** C# (rahat çalışırsınız)

**Çalıştırma:**
```bash
cd backend
dotnet watch run
```

**Mevcut Controller'lar:**
- `CategoriesController.cs` - Kategori işlemleri
- `ProductsController.cs` - Ürün işlemleri
- `AuthController.cs` (backoffice) - Giriş/çıkış

**Veritabanı:**
- PostgreSQL (Supabase)
- Entity Framework Core
- Code-First yaklaşım

### Frontend (React) - Basit Tutulan Kısım

**Port:** `http://localhost:5173`
**Dil:** TypeScript (JavaScript benzeri)

**Çalıştırma:**
```bash
cd frontend
npm run dev
```

**Yapısı:**
- Klasik React component'leri
- Karmaşık Next.js özellikleri YOK
- Basit routing (React Router)
- API çağrıları için Axios

## Hızlı Başlangıç

### 1. İlk Kurulum

**Ana Proje:**
```bash
# Backend
cd backend
dotnet restore

# Frontend
cd frontend
npm install
```

**Backoffice (Admin Paneli):**
```bash
# Backend
cd backoffice/backend
dotnet restore

# Frontend
cd backoffice/frontend
npm install
```

### 2. Veritabanı Şifresi
`backend/appsettings.json` dosyasını açın:
```json
"DefaultConnection": "Host=db.aotmfmixngkuglekhzbw.supabase.co;Database=postgres;Username=postgres;Password=BURAYA_SUPABASE_SIFRENIZ;..."
```

### 3. Migration
```bash
cd backend
dotnet ef database update
```

### 4. Çalıştırma

**Ana Proje (Müşteri Tarafı):**

İki terminal açın:

**Terminal 1:**
```bash
./start-backend.sh
```

**Terminal 2:**
```bash
./start-frontend.sh
```

**Backoffice (Admin Paneli):**

İki terminal daha açın:

**Terminal 3:**
```bash
cd backoffice
./start-backend.sh
```

**Terminal 4:**
```bash
cd backoffice
./start-frontend.sh
```

## Günlük Geliştirme İş Akışı

Siz çoğunlukla **backend** tarafında çalışacaksınız:

1. **Yeni API endpoint eklemek için:**
   - `Controllers/` klasöründe yeni controller
   - Swagger'dan test edin
   - Frontend otomatik kullanacak

2. **Yeni veritabanı tablosu için:**
   - `Models/` klasöründe model oluştur
   - `Data/BGoodyFoodDbContext.cs`'e DbSet ekle
   - `dotnet ef migrations add YeniTablo`
   - `dotnet ef database update`

3. **İş mantığı için:**
   - `Services/` klasöründe interface ve sınıf
   - `Program.cs`'e dependency injection ekle

## Teknoloji Karşılaştırması

| Özellik | Backend (.NET) | Frontend (React) |
|---------|----------------|------------------|
| **Dil** | C# | TypeScript |
| **Rahat mısınız?** | ✅ EVET | ❌ Biraz karışık |
| **Neler yaparsınız?** | API, Veritabanı, İş Mantığı | UI, Görsel Kısım |
| **Port** | 5000 | 5173 |
| **Test** | Swagger | Browser |

## Size Tavsiyeler

1. **Backend'de çalışın** - C# biliyorsunuz, rahat edersiniz
2. **Frontend'e az dokunun** - Sadece gerekirse
3. **Swagger kullanın** - API'lerinizi test için mükemmel
4. **Migration'ları unutmayın** - Her model değişikliğinde
5. **Serilog kullanın** - Log kayıtları için hazır

## Dosyalar

**Ana Proje:**
- `README.md` - Genel bilgiler
- `GELISTIRME-KILAVUZU.md` - Detaylı geliştirme rehberi
- `PROJE-YAPISI.md` - Bu dosya
- `start-backend.sh` - Backend başlatma script'i
- `start-frontend.sh` - Frontend başlatma script'i

**Backoffice:**
- `backoffice/README.md` - Backoffice genel bilgi
- `backoffice/KURULUM.md` - Backoffice detaylı kurulum
- `backoffice/start-backend.sh` - Admin backend başlatma
- `backoffice/start-frontend.sh` - Admin frontend başlatma

## Sorular?

### "Migration nasıl yapılır?"
```bash
cd backend
dotnet ef migrations add MigrationAdi
dotnet ef database update
```

### "API'yi nasıl test ederim?"
```
http://localhost:5000/swagger
```

### "Frontend'de değişiklik yapmam lazım mı?"
Genellikle HAYIR. Backend API'leri yazarsanız, frontend onları otomatik kullanır.

### "Veritabanı şifremi nasıl bulurum?"
Supabase Dashboard > Settings > Database > Connection string

## URL'ler ve Portlar

| Uygulama | URL | Port | Kullanım |
|----------|-----|------|----------|
| Müşteri Frontend | http://localhost:5173 | 5173 | E-ticaret sitesi |
| Müşteri Backend | http://localhost:5000 | 5000 | Müşteri API |
| Müşteri Swagger | http://localhost:5000/swagger | 5000 | API Dokümantasyonu |
| Admin Frontend | http://localhost:3000 | 3000 | Admin paneli |
| Admin Backend | http://localhost:5001 | 5001 | Admin API |
| Admin Swagger | http://localhost:5001/swagger | 5001 | Admin API Dokümantasyonu |

## Önemli
- Projeniz **2 ayrı uygulama**: Ana site + Admin paneli
- Her ikisi de **.NET backend + React frontend**
- Her ikisi de **Supabase PostgreSQL** kullanır
- Siz backend'de C# ile rahatça çalışabilirsiniz!
