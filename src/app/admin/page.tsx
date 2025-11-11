'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  User,
  ShoppingCart, 
  Package, 
  TrendingUp,
  Heart,
  Brain,
  Settings,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Loader2,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import AdminLayout from '@/components/admin/admin-layout';
import RevenueChart from '@/components/admin/charts/revenue-chart';
import SalesChart from '@/components/admin/charts/sales-chart';
import ActivityChart from '@/components/admin/charts/activity-chart';
import { adminApi, DashboardStats } from '@/lib/api/admin';
import { fallbackDashboardStats, fallbackSalesData } from '@/lib/api/fallback-data';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats & {
    avgOrderValue?: number;
    evaluatedProducts?: number;
    pendingEvaluations?: number;
    monthlyGrowth?: number;
  }>({
    ...fallbackDashboardStats,
    avgOrderValue: 290.50,
    evaluatedProducts: 32,
    pendingEvaluations: 13,
    monthlyGrowth: 12.5
  });
  const [salesData, setSalesData] = useState(fallbackSalesData);
  const [loading, setLoading] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);

  // Mock data for charts
  const revenueData = [
    { date: 'Oca 01', revenue: 45000, orders: 120 },
    { date: 'Oca 08', revenue: 52000, orders: 145 },
    { date: 'Oca 15', revenue: 48000, orders: 130 },
    { date: 'Oca 22', revenue: 61000, orders: 165 },
    { date: 'Oca 29', revenue: 58000, orders: 155 },
    { date: 'Şub 05', revenue: 67000, orders: 180 },
    { date: 'Şub 12', revenue: 72000, orders: 195 },
  ];

  const categoryData = [
    { name: 'Meyveler', value: 450, color: '#10b981' },
    { name: 'Sebzeler', value: 380, color: '#3b82f6' },
    { name: 'Süt Ürünleri', value: 290, color: '#f59e0b' },
    { name: 'Bakliyat', value: 210, color: '#ef4444' },
    { name: 'Et & Tavuk', value: 180, color: '#8b5cf6' },
    { name: 'Bal & Reçel', value: 120, color: '#ec4899' },
  ];

  const activityData = [
    { time: '00:00', users: 45, orders: 12, pageViews: 230 },
    { time: '04:00', users: 23, orders: 5, pageViews: 120 },
    { time: '08:00', users: 89, orders: 28, pageViews: 450 },
    { time: '12:00', users: 156, orders: 45, pageViews: 680 },
    { time: '16:00', users: 134, orders: 38, pageViews: 590 },
    { time: '20:00', users: 98, orders: 32, pageViews: 410 },
  ];

  useEffect(() => {
    // Check if user is admin
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    loadDashboardStats();
  }, [isAuthenticated, user, router]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Try to load from .NET API first
      try {
        const dashboardStats = await adminApi.getDashboardStats();
        const salesReport = await adminApi.getSalesReport({ period: '7days' });
        
        // Calculate avgOrderValue if not provided
        const avgOrderValue = dashboardStats.totalOrders > 0 
          ? dashboardStats.totalRevenue / dashboardStats.totalOrders 
          : 0;

        // Merge with additional required properties
        const enhancedStats = {
          ...dashboardStats,
          avgOrderValue,
          evaluatedProducts: Math.floor(dashboardStats.totalProducts * 0.7), // Mock: 70% evaluated
          pendingEvaluations: Math.floor(dashboardStats.totalProducts * 0.1), // Mock: 10% pending
          monthlyGrowth: dashboardStats.revenueGrowth // Alias for compatibility
        };
        
        setStats(enhancedStats);
        setSalesData(salesReport);
        setApiConnected(true);
        console.log('✅ .NET API connected successfully');
      } catch (apiError) {
        console.log('⚠️ .NET API not available, using fallback data');
        
        // Fallback to existing API endpoints
        const productsResponse = await fetch('/api/products?limit=100');
        const productsData = productsResponse.ok ? await productsResponse.json() : { products: [] };
        
        const usersResponse = await fetch('/api/admin/users');
        const usersData = usersResponse.ok ? await usersResponse.json() : { users: [] };
        
        const ordersResponse = await fetch('/api/admin/orders');
        const ordersData = ordersResponse.ok ? await ordersResponse.json() : { orders: [] };
        
        const evaluationsResponse = await fetch('/api/nutritional-evaluation/batch');
        const evaluationsData = evaluationsResponse.ok ? await evaluationsResponse.json() : { evaluations: [] };

        const totalRevenue = ordersData.orders?.reduce((sum: number, order: any) => sum + order.total, 0) || 0;
        const avgOrderValue = ordersData.orders?.length > 0 ? totalRevenue / ordersData.orders.length : 0;
        const evaluatedProducts = evaluationsData.evaluations?.length || 0;

        setStats({
          totalProducts: productsData.products?.length || 0,
          totalOrders: ordersData.orders?.length || 0,
          totalCustomers: usersData.users?.length || 0,
          totalRevenue,
          revenueGrowth: 12.5,
          orderGrowth: 8.3,
          customerGrowth: 15.7,
          productGrowth: 5.2,
          avgOrderValue,
          evaluatedProducts,
          pendingEvaluations: Math.max(0, (productsData.products?.length || 0) - evaluatedProducts),
          monthlyGrowth: 12.5
        });
        setApiConnected(false);
      }
    } catch (error) {
      console.error('Dashboard stats loading error:', error);
      // Enhanced fallback stats with all required properties
      const enhancedFallbackStats = {
        ...fallbackDashboardStats,
        avgOrderValue: 290.50,
        evaluatedProducts: 32,
        pendingEvaluations: 13,
        monthlyGrowth: 12.5
      };
      setStats(enhancedFallbackStats);
      setSalesData(fallbackSalesData);
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Yetkisiz Erişim</h1>
          <p className="text-gray-600 mb-4">Bu sayfaya erişim izniniz yok.</p>
          <Button onClick={() => router.push('/')}>Ana Sayfaya Dön</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout title="Admin Panel" subtitle="Yükleniyor...">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </AdminLayout>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    change,
    format = 'number'
  }: any) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <div className={`flex items-center text-sm ${
              change >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change >= 0 ? (
                <ArrowUpRight className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDownRight className="w-4 h-4 mr-1" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {format === 'currency' 
              ? `₺${value.toLocaleString('tr-TR')}`
              : value.toLocaleString('tr-TR')
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout 
      title="Admin Panel" 
      subtitle={`Hoş geldiniz, ${user?.name}`}
    >
      {/* API Connection Status */}
      <div className="mb-6">
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          apiConnected 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          {apiConnected ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                ✅ .NET API Bağlantısı Aktif - Gerçek veriler kullanılıyor
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                ⚠️ .NET API Bağlantısı Pasif - Örnek veriler kullanılıyor
              </span>
            </>
          )}
        </div>
      </div>
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Toplam Gelir"
            value={stats.totalRevenue}
            icon={DollarSign}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            change={stats.monthlyGrowth}
            format="currency"
          />
          <StatCard
            title="Toplam Siparişler"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
            change={15.3}
          />
          <StatCard
            title="Toplam Kullanıcılar"
            value={stats.totalCustomers}
            icon={Users}
            color="bg-gradient-to-br from-purple-500 to-pink-600"
            change={stats.customerGrowth}
          />
          <StatCard
            title="Dönüşüm Oranı"
            value={4.8}
            icon={TrendingUp}
            color="bg-gradient-to-br from-orange-500 to-red-600"
            change={2.1}
            format="number"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart data={salesData} />
          <SalesChart data={categoryData} />
        </div>

        {/* Activity and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActivityChart data={activityData} />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Besin Değerlendirmesi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Değerlendirilen Ürünler</span>
                <span className="font-bold">{stats.evaluatedProducts || 0}</span>
              </div>
              <Progress 
                value={stats.totalProducts > 0 ? ((stats.evaluatedProducts || 0) / stats.totalProducts) * 100 : 0} 
                className="h-2"
              />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bekleyenler</span>
                <Badge variant="outline">{stats.pendingEvaluations || 0}</Badge>
              </div>
              <Link href="/admin/nutritional-evaluation">
                <Button className="w-full mt-4">
                  <Brain className="w-4 h-4 mr-2" />
                  Değerlendirmeleri Yönet
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Hızlı İstatistikler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ortalama Sepet</span>
                <span className="font-bold">₺{(stats.avgOrderValue || 0).toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Aktif Ürünler</span>
                <Badge className="bg-green-100 text-green-800">
                  {stats.totalProducts}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">AI Analizleri</span>
                <Badge className="bg-purple-100 text-purple-800">
                  {apiConnected ? 'AI Aktif' : 'Demo'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sistem Durumu</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Aktif
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Son Aktiviteler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: ShoppingCart, color: 'text-blue-500', title: 'Yeni sipariş', desc: 'Elma Organik 2kg', time: '5 dakika önce' },
                { icon: User, color: 'text-green-500', title: 'Yeni kullanıcı', desc: 'ahmet.yilmaz@email.com', time: '15 dakika önce' },
                { icon: Heart, color: 'text-red-500', title: 'Besin analizi', desc: 'Domates için AI analizi tamamlandı', time: '1 saat önce' },
                { icon: Package, color: 'text-purple-500', title: 'Yeni ürün', desc: 'Organik Havuç eklendi', time: '2 saat önce' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.desc}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}