// Fallback data for when .NET API is not available
import { Product, Order, User, DashboardStats, SalesData } from './admin';

export const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Organik Domates',
    description: 'Taze organik domatesler, gübre ve pestisit kullanılmadan yetiştirilmiştir.',
    price: 25.99,
    category: 'Sebzeler',
    stock: 150,
    isActive: true,
    isOrganic: true,
    isFeatured: true,
    sku: 'ORG-DOM-001',
    imageUrl: 'https://images.unsplash.com/photo-1542931287-023b9333a1c5?w=200&h=200&fit=crop&crop=center',
    image: 'https://images.unsplash.com/photo-1542931287-023b9333a1c5?w=200&h=200&fit=crop&crop=center',
    unit: 'kg',
    minOrderQuantity: 1,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Organik Elma',
    description: 'Vitamin dolu organik elmalar, doğal yöntemlerle yetiştirilmiştir.',
    price: 18.50,
    category: 'Meyveler',
    stock: 200,
    isActive: true,
    isOrganic: true,
    isFeatured: false,
    sku: 'ORG-ELM-002',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop&crop=center',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop&crop=center',
    unit: 'kg',
    minOrderQuantity: 1,
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T09:15:00Z'
  },
  {
    id: '3',
    name: 'Organik Ispanak',
    description: 'Taze organik ıspanak, demir ve vitamin açısından zengindir.',
    price: 12.75,
    category: 'Yeşillikler',
    stock: 75,
    isActive: true,
    isOrganic: true,
    isFeatured: false,
    sku: 'ORG-ISP-003',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&h=200&fit=crop&crop=center',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&h=200&fit=crop&crop=center',
    unit: 'demet',
    minOrderQuantity: 1,
    createdAt: '2024-01-13T14:20:00Z',
    updatedAt: '2024-01-13T14:20:00Z'
  },
  {
    id: '4',
    name: 'Organik Havuç',
    description: 'Beta-karoten açısından zengin organik havuçlar.',
    price: 15.25,
    category: 'Sebzeler',
    stock: 0,
    isActive: false,
    isOrganic: true,
    isFeatured: false,
    sku: 'ORG-HAV-004',
    imageUrl: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=200&h=200&fit=crop&crop=center',
    image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=200&h=200&fit=crop&crop=center',
    unit: 'kg',
    minOrderQuantity: 1,
    createdAt: '2024-01-12T11:45:00Z',
    updatedAt: '2024-01-16T08:30:00Z'
  },
  {
    id: '5',
    name: 'Organik Portakal',
    description: 'C vitamini deposu organik portakallar.',
    price: 22.00,
    category: 'Meyveler',
    stock: 120,
    isActive: false,
    isOrganic: true,
    isFeatured: false,
    sku: 'ORG-POR-005',
    imageUrl: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop&crop=center',
    image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop&crop=center',
    unit: 'kg',
    minOrderQuantity: 1,
    createdAt: '2024-01-11T16:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z'
  }
];

export const fallbackOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerName: 'Ahmet Yılmaz',
    customerEmail: 'ahmet.yilmaz@email.com',
    totalAmount: 125.50,
    status: 'delivered',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Organik Domates',
        quantity: 2,
        price: 25.99
      },
      {
        id: '2',
        productId: '2',
        productName: 'Organik Elma',
        quantity: 3,
        price: 18.50
      }
    ],
    createdAt: '2024-01-15T14:30:00Z',
    updatedAt: '2024-01-16T10:15:00Z'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerName: 'Ayşe Demir',
    customerEmail: 'ayse.demir@email.com',
    totalAmount: 87.25,
    status: 'processing',
    items: [
      {
        id: '3',
        productId: '3',
        productName: 'Organik Ispanak',
        quantity: 1,
        price: 12.75
      },
      {
        id: '4',
        productId: '4',
        productName: 'Organik Havuç',
        quantity: 3,
        price: 15.25
      }
    ],
    createdAt: '2024-01-16T09:45:00Z',
    updatedAt: '2024-01-16T11:20:00Z'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerName: 'Mehmet Kaya',
    customerEmail: 'mehmet.kaya@email.com',
    totalAmount: 156.75,
    status: 'pending',
    items: [
      {
        id: '5',
        productId: '1',
        productName: 'Organik Domates',
        quantity: 3,
        price: 25.99
      },
      {
        id: '6',
        productId: '2',
        productName: 'Organik Elma',
        quantity: 2,
        price: 18.50
      },
      {
        id: '7',
        productId: '5',
        productName: 'Organik Portakal',
        quantity: 2,
        price: 22.00
      }
    ],
    createdAt: '2024-01-16T13:20:00Z',
    updatedAt: '2024-01-16T13:20:00Z'
  }
];

export const fallbackUsers: User[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet.yilmaz@email.com',
    role: 'customer',
    status: 'active',
    registrationDate: '2024-01-01T10:00:00Z',
    lastLogin: '2024-01-16T09:30:00Z',
    totalOrders: 5,
    totalSpent: 425.50
  },
  {
    id: '2',
    name: 'Ayşe Demir',
    email: 'ayse.demir@email.com',
    role: 'customer',
    status: 'active',
    registrationDate: '2024-01-05T14:15:00Z',
    lastLogin: '2024-01-16T08:45:00Z',
    totalOrders: 3,
    totalSpent: 287.25
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    email: 'mehmet.kaya@email.com',
    role: 'customer',
    status: 'active',
    registrationDate: '2024-01-10T11:30:00Z',
    lastLogin: '2024-01-15T16:20:00Z',
    totalOrders: 2,
    totalSpent: 156.75
  },
  {
    id: '4',
    name: 'Admin User',
    email: 'admin@bgoody.com',
    role: 'admin',
    status: 'active',
    registrationDate: '2023-12-01T00:00:00Z',
    lastLogin: '2024-01-16T12:00:00Z',
    totalOrders: 0,
    totalSpent: 0
  }
];

export const fallbackDashboardStats: DashboardStats = {
  totalRevenue: 45234.50,
  totalOrders: 156,
  totalCustomers: 89,
  totalProducts: 45,
  revenueGrowth: 12.5,
  orderGrowth: 8.3,
  customerGrowth: 15.7,
  productGrowth: 5.2
};

export const fallbackSalesData: SalesData[] = [
  { date: '2024-01-10', revenue: 1250.50, orders: 12, customers: 8 },
  { date: '2024-01-11', revenue: 1580.75, orders: 15, customers: 10 },
  { date: '2024-01-12', revenue: 980.25, orders: 9, customers: 6 },
  { date: '2024-01-13', revenue: 2145.00, orders: 20, customers: 14 },
  { date: '2024-01-14', revenue: 1875.50, orders: 18, customers: 12 },
  { date: '2024-01-15', revenue: 2340.75, orders: 22, customers: 16 },
  { date: '2024-01-16', revenue: 1689.25, orders: 16, customers: 11 }
];

export const categories = [
  'Tümü',
  'Meyveler',
  'Sebzeler',
  'Yeşillikler',
  'Bakliyatlar',
  'Süt Ürünleri',
  'Et Ürünleri',
  'Diğer'
];

export const orderStatuses = [
  { value: 'pending', label: 'Beklemede', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'İşleniyor', color: 'bg-blue-100 text-blue-800' },
  { value: 'shipped', label: 'Kargoda', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Teslim Edildi', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'İptal Edildi', color: 'bg-red-100 text-red-800' }
];

export const userRoles = [
  { value: 'customer', label: 'Müşteri' },
  { value: 'admin', label: 'Yönetici' },
  { value: 'manager', label: 'Yönetici' }
];