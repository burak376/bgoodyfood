# BGoodyFood Admin Panel

A comprehensive admin panel for managing BGoodyFood organic food store, built with React frontend and .NET Web API backend.

## 🏗️ Project Structure

```
backoffice/
├── backend/          # .NET 8.0 Web API
│   ├── Controllers/  # API Controllers
│   ├── Data/         # Database Context & Seed Data
│   ├── Models/       # Entity Models
│   └── Program.cs    # Application Configuration
└── frontend/         # React TypeScript App
    ├── src/
    │   ├── components/ # React Components
    │   ├── contexts/   # React Contexts
    │   ├── pages/      # Page Components
    │   └── App.tsx     # Main App Component
    └── package.json
```

## 🚀 Features

### 🔐 Authentication
- JWT-based authentication
- Login/Logout functionality
- Password change capability
- Protected routes

### 📊 Dashboard
- Real-time statistics
- Product count overview
- Order management summary
- User analytics

### 🛍️ Product Management
- CRUD operations for products
- Product categorization
- Stock management
- Multi-language support (English/Turkish)
- Organic/Featured product flags

### 📦 Order Management
- Order status tracking
- Payment status monitoring
- Customer information display
- Order filtering

### 👥 User Management
- Admin user management
- User activity tracking
- Account status management

## 🛠️ Technology Stack

### Backend (.NET 8.0)
- **Framework**: ASP.NET Core Web API
- **Database**: SQLite with Entity Framework Core
- **Authentication**: JWT Bearer Authentication
- **Documentation**: Swagger/OpenAPI
- **Architecture**: Clean Architecture with Repository Pattern

### Frontend (React 18)
- **Framework**: React with TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Styling**: Material-UI Theme System

## 📋 Installation & Setup

### Prerequisites
- .NET 8.0 SDK
- Node.js 16+ 
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the application:
```bash
dotnet run --urls="http://localhost:5000"
```

4. Access Swagger documentation:
```
http://localhost:5000/swagger
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Access the application:
```
http://localhost:3000
```

## 🔑 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}/status` - Update order status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## 🗄️ Database Schema

### Tables
- **AdminUsers** - Admin user accounts
- **Products** - Product catalog
- **Orders** - Customer orders
- **OrderItems** - Order line items

### Seed Data
The application automatically seeds with:
- 1 admin user (admin/admin123)
- 3 sample products
- 2 sample orders
- Sample order items

## 🎨 UI Features

### Material-UI Components
- Responsive design
- Dark/Light theme support
- Data tables with pagination
- Forms with validation
- Modals and dialogs
- Navigation drawer
- Status indicators

### User Experience
- Loading states
- Error handling
- Success notifications
- Confirmation dialogs
- Search and filtering
- Sorting capabilities

## 🔧 Configuration

### Backend Configuration (appsettings.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=admin.db"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key",
    "Issuer": "BGoodyFood",
    "Audience": "BGoodyFood.Admin",
    "ExpirationInMinutes": 60
  }
}
```

### Frontend Configuration
- API base URL: `http://localhost:5000`
- Default theme: Light mode
- Pagination: 10 items per page

## 🚀 Deployment

### Backend Deployment
1. Publish the application:
```bash
dotnet publish -c Release
```

2. Configure environment variables
3. Set up reverse proxy (nginx/IIS)
4. Configure SSL certificate

### Frontend Deployment
1. Build the application:
```bash
npm run build
```

2. Deploy to static hosting service
3. Configure API base URL
4. Set up routing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API documentation at `/swagger`

---

**Built with ❤️ for BGoodyFood Organic Store**