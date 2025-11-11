'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Download, Calendar, Brain, AlertCircle, CheckCircle, Loader2, Eye, Navigation, Users, Target } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import AdminLayout from '@/components/admin/admin-layout';
import AIFeatures from '@/components/admin/ai-features';
import { adminApi } from '@/lib/api/admin';

interface ReportData {
  salesData: any[];
  revenueData: any[];
  topProducts: any[];
  customerAnalytics: any;
  inventoryData: any[];
}

export default function AdminReports() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);
  const [reportData, setReportData] = useState<ReportData>({
    salesData: [],
    revenueData: [],
    topProducts: [],
    customerAnalytics: null,
    inventoryData: []
  });
  const [dateRange, setDateRange] = useState({
    period: '30days',
    dateFrom: '',
    dateTo: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    loadReportData();
  }, [isAuthenticated, user, router, dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      
      // Try to load from .NET API first
      try {
        const [salesReport, topProducts, customerAnalytics, inventoryReport] = await Promise.all([
          adminApi.getSalesReport({ period: dateRange.period, dateFrom: dateRange.dateFrom, dateTo: dateRange.dateTo }),
          adminApi.getTopProducts(10),
          adminApi.getCustomerAnalytics(),
          adminApi.getInventoryReport()
        ]);
        
        setReportData({
          salesData: salesReport || [],
          revenueData: salesReport || [],
          topProducts: topProducts || [],
          customerAnalytics: customerAnalytics || null,
          inventoryData: inventoryReport || []
        });
        setApiConnected(true);
        console.log('✅ Reports loaded from .NET API');
      } catch (apiError) {
        console.log('⚠️ .NET API not available, using fallback data');
        
        // Fallback to existing API endpoints
        const ordersResponse = await fetch('/api/admin/orders');
        const productsResponse = await fetch('/api/products?limit=100');
        const usersResponse = await fetch('/api/admin/users');
        
        const ordersData = ordersResponse.ok ? await ordersResponse.json() : { orders: [] };
        const productsData = productsResponse.ok ? await productsResponse.json() : { products: [] };
        const usersData = usersResponse.ok ? await usersResponse.json() : { users: [] };
        
        // Process fallback data
        const salesData = processSalesData(ordersData.orders || []);
        const topProducts = processTopProducts(ordersData.orders || [], productsData.products || []);
        const inventoryData = processInventoryData(productsData.products || []);
        
        setReportData({
          salesData,
          revenueData: salesData,
          topProducts,
          customerAnalytics: {
            totalCustomers: usersData.users?.length || 0,
            activeCustomers: usersData.users?.filter((u: any) => u.status === 'active').length || 0,
            newCustomers: usersData.users?.filter((u: any) => {
              const registrationDate = new Date(u.registrationDate);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return registrationDate > thirtyDaysAgo;
            }).length || 0,
            averageLifetimeValue: 2450,
            customerGrowth: 15.7,
            segments: [
              { name: 'VIP Müşteriler', description: '₺5,000+ harcama', count: 23, percentage: '8.2' },
              { name: 'Sadık Müşteriler', description: '10+ sipariş', count: 67, percentage: '23.9' },
              { name: 'Düzenli Müşteriler', description: '3-9 sipariş', count: 124, percentage: '44.1' },
              { name: 'Yeni Müşteriler', description: '1-2 sipariş', count: 67, percentage: '23.8' }
            ],
            demographics: [
              { category: 'İstanbul', value: '34%', percentage: 34 },
              { category: 'Ankara', value: '18%', percentage: 18 },
              { category: 'İzmir', value: '15%', percentage: 15 },
              { category: 'Diğer', value: '33%', percentage: 33 }
            ],
            topCustomers: [
              { id: '1', name: 'Ahmet Yılmaz', email: 'ahmet.yilmaz@email.com', totalSpent: 12450, totalOrders: 28 },
              { id: '2', name: 'Ayşe Demir', email: 'ayse.demir@email.com', totalSpent: 8920, totalOrders: 19 },
              { id: '3', name: 'Mehmet Kaya', email: 'mehmet.kaya@email.com', totalSpent: 6780, totalOrders: 15 }
            ],
            mostViewedProducts: [
              { id: '1', name: 'Organik Domates', category: 'Sebzeler', viewCount: 1247 },
              { id: '2', name: 'Taze Çilek', category: 'Meyveler', viewCount: 982 },
              { id: '3', name: 'Yeşil Elma', category: 'Meyveler', viewCount: 856 },
              { id: '4', name: 'Organik Salatalık', category: 'Sebzeler', viewCount: 743 },
              { id: '5', name: 'Portakal', category: 'Meyveler', viewCount: 692 }
            ],
            pageNavigation: [
              { name: 'Ana Sayfa', path: '/', visits: 3421 },
              { name: 'Ürünler', path: '/products', visits: 2156 },
              { name: 'Kategoriler', path: '/categories', visits: 1843 },
              { name: 'Sepet', path: '/cart', visits: 967 },
              { name: 'Hakkımızda', path: '/about', visits: 523 }
            ],
            ageBasedPreferences: [
              { ageGroup: '18-25 Yaş', topProduct: 'Organik Atıştırmalıklar', percentage: 78 },
              { ageGroup: '26-35 Yaş', topProduct: 'Taze Meyveler', percentage: 85 },
              { ageGroup: '36-50 Yaş', topProduct: 'Organik Sebzeler', percentage: 92 },
              { ageGroup: '50+ Yaş', topProduct: 'Sağlıklı Yaşam Ürünleri', percentage: 88 }
            ],
            regionalNavigation: [
              { region: 'İstanbul', favoritePage: 'Kampanyalar', percentage: 82 },
              { region: 'Ankara', favoritePage: 'Ürünler', percentage: 76 },
              { region: 'İzmir', favoritePage: 'Yeni Ürünler', percentage: 71 },
              { region: 'Diğer Şehirler', favoritePage: 'Ana Sayfa', percentage: 68 }
            ]
          },
          inventoryData
        });
        setApiConnected(false);
      }
    } catch (error) {
      console.error('Reports loading error:', error);
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const processSalesData = (orders: any[]) => {
    const dailySales: { [key: string]: { revenue: number; orders: number; customers: number } } = {};
    
    orders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString('tr-TR');
      if (!dailySales[date]) {
        dailySales[date] = { revenue: 0, orders: 0, customers: 0 };
      }
      dailySales[date].revenue += order.totalAmount || order.total || 0;
      dailySales[date].orders += 1;
      dailySales[date].customers += 1;
    });
    
    return Object.entries(dailySales).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
      customers: data.customers
    })).slice(-30); // Son 30 gün
  };

  const processTopProducts = (orders: any[], products: any[]) => {
    const productSales: { [key: string]: { name: string; sales: number; revenue: number } } = {};
    
    orders.forEach(order => {
      (order.items || []).forEach((item: any) => {
        const productId = item.productId || item.id;
        if (!productSales[productId]) {
          const product = products.find((p: any) => p.id === productId);
          productSales[productId] = {
            name: product?.name || item.productName || 'Bilinmeyen Ürün',
            sales: 0,
            revenue: 0
          };
        }
        productSales[productId].sales += item.quantity || 1;
        productSales[productId].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });
    
    return Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  };

  const processInventoryData = (products: any[]) => {
    return products.map(product => ({
      id: product.id,
      name: product.name,
      stock: product.stock || 0,
      status: product.stock > 10 ? 'good' : product.stock > 0 ? 'low' : 'out',
      category: typeof product.category === 'string' ? product.category : product.category?.name || 'Bilinmiyor'
    }));
  };

  const handleDateRangeChange = (period: string) => {
    const today = new Date();
    let dateFrom = '';
    let dateTo = today.toISOString().split('T')[0];
    
    switch (period) {
      case '7days':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        dateFrom = sevenDaysAgo.toISOString().split('T')[0];
        break;
      case '30days':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        dateFrom = thirtyDaysAgo.toISOString().split('T')[0];
        break;
      case '90days':
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        dateFrom = ninetyDaysAgo.toISOString().split('T')[0];
        break;
      default:
        return;
    }
    
    setDateRange({ period, dateFrom, dateTo });
    setShowDatePicker(false);
  };

  const handleCustomDateRange = (from: string, to: string) => {
    setDateRange({ period: 'custom', dateFrom: from, dateTo: to });
    setShowDatePicker(false);
  };

  const handleDownloadReport = async (reportType: string) => {
    try {
      if (apiConnected) {
        // Use .NET API for download
        const response = await fetch(`/api/reports/download?type=${reportType}&period=${dateRange.period}&dateFrom=${dateRange.dateFrom}&dateTo=${dateRange.dateTo}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      } else {
        // Fallback: Create simple CSV
        let csvContent = '';
        switch (reportType) {
          case 'sales':
            csvContent = 'Date,Revenue,Orders,Customers\n';
            reportData.salesData.forEach(item => {
              csvContent += `${item.date},${item.revenue},${item.orders},${item.customers}\n`;
            });
            break;
          case 'revenue':
            csvContent = 'Date,Revenue,Average Revenue,Performance\n';
            const avgRevenue = reportData.revenueData.reduce((sum, item) => sum + item.revenue, 0) / Math.max(reportData.revenueData.length, 1);
            reportData.revenueData.forEach(item => {
              const performance = item.revenue > avgRevenue ? 'Above Average' : 'Below Average';
              csvContent += `${item.date},${item.revenue},${avgRevenue.toFixed(2)},${performance}\n`;
            });
            break;
          case 'products':
            csvContent = 'Product Name,Sales,Revenue\n';
            reportData.topProducts.forEach(item => {
              csvContent += `${item.name},${item.sales},${item.revenue}\n`;
            });
            break;
          case 'inventory':
            csvContent = 'Product Name,Stock,Status,Category\n';
            reportData.inventoryData.forEach(item => {
              csvContent += `${item.name},${item.stock},${item.status},${item.category}\n`;
            });
            break;
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Rapor indirilemedi. Lütfen tekrar deneyin.');
    }
  };

  const getReportContent = (reportType: string) => {
    switch (reportType) {
      case 'sales':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Pazarlama Raporu</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Son {dateRange.period === '7days' ? '7' : dateRange.period === '30days' ? '30' : '90'} gün
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {apiConnected ? 'Canlı Veri' : 'Örnek Veri'}
                </Badge>
              </div>
            </div>

            {/* Ana Metrikler */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Gelir</p>
                      <p className="text-xl font-bold text-green-600">₺{reportData.salesData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('tr-TR')}</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-1">+12.5% geçen aya göre</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Sipariş</p>
                      <p className="text-xl font-bold text-blue-600">{reportData.salesData.reduce((sum, item) => sum + item.orders, 0)}</p>
                    </div>
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-blue-600 mt-1">+8.3% geçen aya göre</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ortalama Sepet</p>
                      <p className="text-xl font-bold text-purple-600">₺{Math.round(reportData.salesData.reduce((sum, item) => sum + item.revenue, 0) / Math.max(reportData.salesData.reduce((sum, item) => sum + item.orders, 0), 1)).toLocaleString('tr-TR')}</p>
                    </div>
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xs text-purple-600 mt-1">+5.2% geçen aya göre</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Dönüşüm Oranı</p>
                      <p className="text-xl font-bold text-orange-600">3.2%</p>
                    </div>
                    <Brain className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-xs text-orange-600 mt-1">+0.8% geçen aya göre</p>
                </CardContent>
              </Card>
            </div>

            {/* Günlük Satış Grafiği */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Günlük Satış Performansı</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
                  {reportData.salesData.length > 0 ? (
                    <div className="space-y-2">
                      {reportData.salesData.slice(-10).reverse().map((item, index) => {
                        const maxRevenue = Math.max(...reportData.salesData.map(d => d.revenue));
                        const percentage = (item.revenue / maxRevenue) * 100;
                        return (
                          <div key={index} className="flex items-center gap-3">
                            <span className="text-sm w-20">{item.date}</span>
                            <div className="flex-1">
                              <div className="w-full bg-gray-200 rounded-full h-6">
                                <div 
                                  className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full flex items-center justify-end pr-2" 
                                  style={{ width: `${percentage}%` }}
                                >
                                  <span className="text-xs text-white font-medium">
                                    ₺{item.revenue.toLocaleString('tr-TR')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right w-16">
                              <p className="text-sm font-medium">{item.orders}</p>
                              <p className="text-xs text-gray-600">sipariş</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Satış verisi bulunamadı</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pazarlama Metrikleri */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Müşteri Edinme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Yeni Müşteriler</span>
                      <span className="font-medium">127</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Müşteri Maliyeti</span>
                      <span className="font-medium">₺85</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Yaşam Boyu Değer</span>
                      <span className="font-medium text-green-600">₺2,450</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Kanal Performansı</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Organik Arama</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sosyal Medya</span>
                      <span className="font-medium">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Direkt Ziyaret</span>
                      <span className="font-medium">30%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Kampanya Etkisi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Aktif Kampanyalar</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Kampanya Geliri</span>
                      <span className="font-medium text-green-600">₺18,750</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">ROI</span>
                      <span className="font-medium text-purple-600">245%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'products':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ürün Performansı</h3>
            <div className="max-h-60 overflow-y-auto">
              {reportData.topProducts.map((product, index) => (
                <div key={product.id} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} adet satıldı</p>
                  </div>
                  <span className="font-medium">₺{product.revenue.toLocaleString('tr-TR')}</span>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'customers':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Müşteri Analizi</h3>
            
            {/* Müşteri İstatistikleri */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">Toplam Müşteri</p>
                  <p className="text-xl font-bold">{reportData.customerAnalytics?.totalCustomers || 0}</p>
                  <p className="text-xs text-green-600">+{reportData.customerAnalytics?.customerGrowth || 15.7}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">Aktif Müşteri</p>
                  <p className="text-xl font-bold">{reportData.customerAnalytics?.activeCustomers || 0}</p>
                  <p className="text-xs text-blue-600">Bu ay</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">Yeni Müşteri</p>
                  <p className="text-xl font-bold">{reportData.customerAnalytics?.newCustomers || 0}</p>
                  <p className="text-xs text-purple-600">Son 30 gün</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-gray-600">Ortalama Yaşam Boyu Değer</p>
                  <p className="text-xl font-bold">₺{Math.round(reportData.customerAnalytics?.averageLifetimeValue || 0).toLocaleString('tr-TR')}</p>
                  <p className="text-xs text-orange-600">Müşteri başına</p>
                </CardContent>
              </Card>
            </div>

            {/* Müşteri Segmentasyonu */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Müşteri Segmentleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.customerAnalytics?.segments?.length > 0 ? (
                      reportData.customerAnalytics.segments.map((segment: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{segment.name}</p>
                            <p className="text-xs text-gray-600">{segment.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{segment.count}</p>
                            <p className="text-xs text-gray-600">%{segment.percentage}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Fallback segment data
                      <>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">VIP Müşteriler</p>
                            <p className="text-xs text-gray-600">₺5,000+ harcama</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">23</p>
                            <p className="text-xs text-gray-600">%8.2</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">Sadık Müşteriler</p>
                            <p className="text-xs text-gray-600">10+ sipariş</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">67</p>
                            <p className="text-xs text-gray-600">%23.9</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">Düzenli Müşteriler</p>
                            <p className="text-xs text-gray-600">3-9 sipariş</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">124</p>
                            <p className="text-xs text-gray-600">%44.1</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">Yeni Müşteriler</p>
                            <p className="text-xs text-gray-600">1-2 sipariş</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">67</p>
                            <p className="text-xs text-gray-600">%23.8</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Demografik Bilgiler</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.customerAnalytics?.demographics?.length > 0 ? (
                      reportData.customerAnalytics.demographics.map((demo: any, index: number) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{demo.category}</span>
                            <span className="font-medium">{demo.value}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${demo.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Fallback demographics data
                      <>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>İstanbul</span>
                            <span className="font-medium">34%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '34%' }}></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Ankara</span>
                            <span className="font-medium">18%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>İzmir</span>
                            <span className="font-medium">15%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Diğer</span>
                            <span className="font-medium">33%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* En Değerli Müşteriler */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">En Değerli Müşteriler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-60 overflow-y-auto">
                  {reportData.customerAnalytics?.topCustomers?.length > 0 ? (
                    reportData.customerAnalytics.topCustomers.map((customer: any, index: number) => (
                      <div key={customer.id} className="flex justify-between items-center p-3 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-green-800">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-gray-600">{customer.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₺{customer.totalSpent.toLocaleString('tr-TR')}</p>
                          <p className="text-xs text-gray-600">{customer.totalOrders} sipariş</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Fallback top customers data
                    <>
                      <div className="flex justify-between items-center p-3 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-green-800">1</span>
                          </div>
                          <div>
                            <p className="font-medium">Ahmet Yılmaz</p>
                            <p className="text-sm text-gray-600">ahmet.yilmaz@email.com</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₺12,450</p>
                          <p className="text-xs text-gray-600">28 sipariş</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-green-800">2</span>
                          </div>
                          <div>
                            <p className="font-medium">Ayşe Demir</p>
                            <p className="text-sm text-gray-600">ayse.demir@email.com</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₺8,920</p>
                          <p className="text-xs text-gray-600">19 sipariş</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-3 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-green-800">3</span>
                          </div>
                          <div>
                            <p className="font-medium">Mehmet Kaya</p>
                            <p className="text-sm text-gray-600">mehmet.kaya@email.com</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₺6,780</p>
                          <p className="text-xs text-gray-600">15 sipariş</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Müşteri Davranış Analizi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    En Çok Görüntülenen Ürünler
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-60 overflow-y-auto">
                    {reportData.customerAnalytics?.mostViewedProducts?.length > 0 ? (
                      reportData.customerAnalytics.mostViewedProducts.map((product: any, index: number) => (
                        <div key={product.id} className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-800">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-600">{product.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{product.viewCount}</p>
                            <p className="text-xs text-gray-600">görüntülenme</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Fallback most viewed products data
                      <>
                        <div className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-800">1</span>
                            </div>
                            <div>
                              <p className="font-medium">Organik Domates</p>
                              <p className="text-sm text-gray-600">Sebzeler</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">1,247</p>
                            <p className="text-xs text-gray-600">görüntülenme</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-800">2</span>
                            </div>
                            <div>
                              <p className="font-medium">Taze Çilek</p>
                              <p className="text-sm text-gray-600">Meyveler</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">982</p>
                            <p className="text-xs text-gray-600">görüntülenme</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-800">3</span>
                            </div>
                            <div>
                              <p className="font-medium">Yeşil Elma</p>
                              <p className="text-sm text-gray-600">Meyveler</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">856</p>
                            <p className="text-xs text-gray-600">görüntülenme</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-800">4</span>
                            </div>
                            <div>
                              <p className="font-medium">Organik Salatalık</p>
                              <p className="text-sm text-gray-600">Sebzeler</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">743</p>
                            <p className="text-xs text-gray-600">görüntülenme</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-800">5</span>
                            </div>
                            <div>
                              <p className="font-medium">Portakal</p>
                              <p className="text-sm text-gray-600">Meyveler</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">692</p>
                            <p className="text-xs text-gray-600">görüntülenme</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-purple-600" />
                    Sayfa Navigasyon Analizi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-60 overflow-y-auto">
                    {reportData.customerAnalytics?.pageNavigation?.length > 0 ? (
                      reportData.customerAnalytics.pageNavigation.map((page: any, index: number) => (
                        <div key={page.path} className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-800">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium">{page.name}</p>
                              <p className="text-sm text-gray-600">{page.path}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{page.visits}</p>
                            <p className="text-xs text-gray-600">ziyaret</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      // Fallback page navigation data
                      <>
                        <div className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-800">1</span>
                            </div>
                            <div>
                              <p className="font-medium">Ana Sayfa</p>
                              <p className="text-sm text-gray-600">/</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">3,421</p>
                            <p className="text-xs text-gray-600">ziyaret</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-800">2</span>
                            </div>
                            <div>
                              <p className="font-medium">Ürünler</p>
                              <p className="text-sm text-gray-600">/products</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">2,156</p>
                            <p className="text-xs text-gray-600">ziyaret</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-800">3</span>
                            </div>
                            <div>
                              <p className="font-medium">Kategoriler</p>
                              <p className="text-sm text-gray-600">/categories</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">1,843</p>
                            <p className="text-xs text-gray-600">ziyaret</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-800">4</span>
                            </div>
                            <div>
                              <p className="font-medium">Sepet</p>
                              <p className="text-sm text-gray-600">/cart</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">967</p>
                            <p className="text-xs text-gray-600">ziyaret</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-800">5</span>
                            </div>
                            <div>
                              <p className="font-medium">Hakkımızda</p>
                              <p className="text-sm text-gray-600">/about</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">523</p>
                            <p className="text-xs text-gray-600">ziyaret</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demografik Davranış Analizi */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  Demografik Davranış Analizi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Yaş Grubuna Göre Ürün Tercihleri */}
                  <div>
                    <h4 className="font-medium mb-3">Yaş Grubuna Göre Ürün Tercihleri</h4>
                    <div className="space-y-3">
                      {reportData.customerAnalytics?.ageBasedPreferences?.length > 0 ? (
                        reportData.customerAnalytics.ageBasedPreferences.map((pref: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{pref.ageGroup}</span>
                              <span className="text-gray-600">{pref.topProduct}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${pref.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Fallback age-based preferences
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">18-25 Yaş</span>
                              <span className="text-gray-600">Organik Atıştırmalıklar</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">26-35 Yaş</span>
                              <span className="text-gray-600">Taze Meyveler</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">36-50 Yaş</span>
                              <span className="text-gray-600">Organik Sebzeler</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">50+ Yaş</span>
                              <span className="text-gray-600">Sağlıklı Yaşam Ürünleri</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bölgeye Göre Navigasyon Davranışları */}
                  <div>
                    <h4 className="font-medium mb-3">Bölgeye Göre Navigasyon Davranışları</h4>
                    <div className="space-y-3">
                      {reportData.customerAnalytics?.regionalNavigation?.length > 0 ? (
                        reportData.customerAnalytics.regionalNavigation.map((region: any, index: number) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{region.region}</span>
                              <span className="text-gray-600">{region.favoritePage}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
                                style={{ width: `${region.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Fallback regional navigation
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">İstanbul</span>
                              <span className="text-gray-600">Kampanyalar</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Ankara</span>
                              <span className="text-gray-600">Ürünler</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">İzmir</span>
                              <span className="text-gray-600">Yeni Ürünler</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '71%' }}></div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">Diğer Şehirler</span>
                              <span className="text-gray-600">Ana Sayfa</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'inventory':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stok Durumu</h3>
            <div className="max-h-60 overflow-y-auto">
              {reportData.inventoryData.map((item, index) => (
                <div key={item.id} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.stock}</span>
                    <Badge className={
                      item.status === 'good' ? 'bg-green-100 text-green-800' :
                      item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {item.status === 'good' ? 'Stokta' :
                       item.status === 'low' ? 'Az' : 'Tükendi'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'revenue':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Gelir Analizi</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Son {dateRange.period === '7days' ? '7' : dateRange.period === '30days' ? '30' : '90'} gün
                </Badge>
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  {apiConnected ? 'Canlı Veri' : 'Örnek Veri'}
                </Badge>
              </div>
            </div>

            {/* Gelir Özeti */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Toplam Gelir</p>
                      <p className="text-xl font-bold text-green-600">₺{reportData.revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('tr-TR')}</p>
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-xs text-green-600 mt-1">+18.2% geçen aya göre</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ortalama Günlük Gelir</p>
                      <p className="text-xl font-bold text-blue-600">₺{Math.round(reportData.revenueData.reduce((sum, item) => sum + item.revenue, 0) / Math.max(reportData.revenueData.length, 1)).toLocaleString('tr-TR')}</p>
                    </div>
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs text-blue-600 mt-1">+7.4% geçen aya göre</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">En İyi Gün</p>
                      <p className="text-xl font-bold text-purple-600">
                        {reportData.revenueData.length > 0 ? 
                          reportData.revenueData.reduce((max, item) => item.revenue > max.revenue ? item : max).date.split(' ')[0] 
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-xs text-purple-600 mt-1">En yüksek gelir</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Gelir Büyümesi</p>
                      <p className="text-xl font-bold text-orange-600">+24.8%</p>
                    </div>
                    <Brain className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-xs text-orange-600 mt-1">Yıllık bazda</p>
                </CardContent>
              </Card>
            </div>

            {/* Gelir Trend Grafiği */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gelir Trend Analizi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
                  {reportData.revenueData.length > 0 ? (
                    <div className="space-y-3">
                      {reportData.revenueData.slice(-14).reverse().map((item, index) => {
                        const maxRevenue = Math.max(...reportData.revenueData.map(d => d.revenue));
                        const percentage = (item.revenue / maxRevenue) * 100;
                        const avgRevenue = reportData.revenueData.reduce((sum, item) => sum + item.revenue, 0) / reportData.revenueData.length;
                        const isAboveAvg = item.revenue > avgRevenue;
                        
                        return (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="w-20">{item.date}</span>
                              <span className={`font-medium ${isAboveAvg ? 'text-green-600' : 'text-red-600'}`}>
                                {isAboveAvg ? '+' : '-'}₺{Math.abs(item.revenue - avgRevenue).toLocaleString('tr-TR')}
                              </span>
                              <span className="w-20 text-right">₺{item.revenue.toLocaleString('tr-TR')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                  <div 
                                    className={`h-4 rounded-full transition-all duration-300 ${
                                      isAboveAvg 
                                        ? 'bg-gradient-to-r from-green-500 to-green-600' 
                                        : 'bg-gradient-to-r from-red-500 to-red-600'
                                    }`} 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="w-16 text-right">
                                <span className={`text-xs font-medium ${isAboveAvg ? 'text-green-600' : 'text-red-600'}`}>
                                  {isAboveAvg ? '↑' : '↓'} {Math.round(percentage)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Gelir verisi bulunamadı</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Gelir Kategorileri */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ürün Kategorisi Geliri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Organik Meyveler</span>
                      <div className="text-right">
                        <p className="font-medium text-green-600">₺28,450</p>
                        <p className="text-xs text-gray-600">35%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Organik Sebzeler</span>
                      <div className="text-right">
                        <p className="font-medium text-blue-600">₺22,320</p>
                        <p className="text-xs text-gray-600">27%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sağlıklı Atıştırmalıklar</span>
                      <div className="text-right">
                        <p className="font-medium text-purple-600">₺18,750</p>
                        <p className="text-xs text-gray-600">23%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Diğer Ürünler</span>
                      <div className="text-right">
                        <p className="font-medium text-orange-600">₺12,480</p>
                        <p className="text-xs text-gray-600">15%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Ödeme Yöntemleri</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Kredi Kartı</span>
                      <div className="text-right">
                        <p className="font-medium">₺58,200</p>
                        <p className="text-xs text-gray-600">71%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Kapıda Ödeme</span>
                      <div className="text-right">
                        <p className="font-medium">₺15,800</p>
                        <p className="text-xs text-gray-600">19%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Havale/EFT</span>
                      <div className="text-right">
                        <p className="font-medium">₺8,000</p>
                        <p className="text-xs text-gray-600">10%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Bölgesel Gelir</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Marmara</span>
                      <div className="text-right">
                        <p className="font-medium text-green-600">₺35,420</p>
                        <p className="text-xs text-gray-600">43%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Ege</span>
                      <div className="text-right">
                        <p className="font-medium text-blue-600">₺24,180</p>
                        <p className="text-xs text-gray-600">29%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">İç Anadolu</span>
                      <div className="text-right">
                        <p className="font-medium text-purple-600">₺15,400</p>
                        <p className="text-xs text-gray-600">19%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Diğer</span>
                      <div className="text-right">
                        <p className="font-medium text-orange-600">₺7,000</p>
                        <p className="text-xs text-gray-600">9%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gelir Tahminleri */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gelir Tahminleri ve Hedefler</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Bu Ay Hedef</p>
                    <p className="text-xl font-bold text-blue-600">₺125,000</p>
                    <p className="text-xs text-blue-600 mt-1">%82 tamamlandı</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Tahmini Bu Ay</p>
                    <p className="text-xl font-bold text-green-600">₺132,000</p>
                    <p className="text-xs text-green-600 mt-1">+5.6% hedef üstü</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Çeyrek Hedef</p>
                    <p className="text-xl font-bold text-purple-600">₺375,000</p>
                    <p className="text-xs text-purple-600 mt-1">%78 tamamlandı</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Yıllık Hedef</p>
                    <p className="text-xl font-bold text-orange-600">₺1,500,000</p>
                    <p className="text-xs text-orange-600 mt-1">%67 tamamlandı</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <p>Rapor yükleniyor...</p>;
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <AdminLayout title="Yetkisiz Erişim" subtitle="Bu sayfaya erişim izniniz yok">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <Button onClick={() => router.push('/')}>Ana Sayfaya Dön</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Raporlar" subtitle="Analiz ve raporlar">
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
        {/* AI Features Section */}
        <AIFeatures />

        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>
                {dateRange.period === '7days' ? 'Son 7 gün' :
                 dateRange.period === '30days' ? 'Son 30 gün' :
                 dateRange.period === '90days' ? 'Son 90 gün' :
                 dateRange.dateFrom && dateRange.dateTo ? 
                 `${dateRange.dateFrom} - ${dateRange.dateTo}` : 'Tarih aralığı'}
              </span>
            </div>
            <div className="relative">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                Tarih Filtresi
              </Button>
              {showDatePicker && (
                <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-48">
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleDateRangeChange('7days')}
                    >
                      Son 7 gün
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleDateRangeChange('30days')}
                    >
                      Son 30 gün
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => handleDateRangeChange('90days')}
                    >
                      Son 90 gün
                    </Button>
                    <div className="border-t pt-2">
                      <p className="text-xs text-gray-500 mb-2">Özel tarih aralığı:</p>
                      <div className="space-y-2">
                        <input
                          type="date"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          value={dateRange.dateFrom}
                          onChange={(e) => setDateRange(prev => ({ ...prev, dateFrom: e.target.value }))}
                        />
                        <input
                          type="date"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          value={dateRange.dateTo}
                          onChange={(e) => setDateRange(prev => ({ ...prev, dateTo: e.target.value }))}
                        />
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleCustomDateRange(dateRange.dateFrom, dateRange.dateTo)}
                          disabled={!dateRange.dateFrom || !dateRange.dateTo}
                        >
                          Uygula
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => handleDownloadReport('sales')}
          >
            <Download className="w-4 h-4 mr-2" />
            Rapor İndir
          </Button>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Pazarlama Raporu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Günlük, haftalık ve aylık satış istatistikleri
              </p>
              <div className="flex items-center justify-between">
                <Badge className="bg-blue-100 text-blue-800">Popüler</Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedReport(selectedReport === 'sales' ? null : 'sales')}
                >
                  {selectedReport === 'sales' ? 'Kapat' : 'Görüntüle'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Gelir Analizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Gelir trendleri ve kar marjı analizi
              </p>
              <div className="flex items-center justify-between">
                <Badge className="bg-green-100 text-green-800">Güncel</Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedReport(selectedReport === 'revenue' ? null : 'revenue')}
                >
                  {selectedReport === 'revenue' ? 'Kapat' : 'Görüntüle'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-500" />
                Ürün Performansı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                En çok satan ürünler ve kategori analizi
              </p>
              <div className="flex items-center justify-between">
                <Badge className="bg-purple-100 text-purple-800">Detaylı</Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedReport(selectedReport === 'products' ? null : 'products')}
                >
                  {selectedReport === 'products' ? 'Kapat' : 'Görüntüle'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                Müşteri Analizi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Müşteri demografisi ve davranış analizi
              </p>
              <div className="flex items-center justify-between">
                <Badge className="bg-orange-100 text-orange-800">Yeni</Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedReport(selectedReport === 'customers' ? null : 'customers')}
                >
                  {selectedReport === 'customers' ? 'Kapat' : 'Görüntüle'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-500" />
                Stok Raporu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Stok durumu ve envanter takibi
              </p>
              <div className="flex items-center justify-between">
                <Badge className="bg-red-100 text-red-800">Önemli</Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedReport(selectedReport === 'inventory' ? null : 'inventory')}
                >
                  {selectedReport === 'inventory' ? 'Kapat' : 'Görüntüle'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-500" />
                Pazarlama Raporu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Kampanya performansı ve dönüşüm oranları
              </p>
              <div className="flex items-center justify-between">
                <Badge className="bg-indigo-100 text-indigo-800">Analitik</Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedReport(selectedReport === 'sales' ? null : 'sales')}
                >
                  {selectedReport === 'sales' ? 'Kapat' : 'Görüntüle'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Report Content */}
        {selectedReport && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  {selectedReport === 'sales' && 'Pazarlama Raporu'}
                  {selectedReport === 'revenue' && 'Gelir Analizi'}
                  {selectedReport === 'products' && 'Ürün Performansı'}
                  {selectedReport === 'customers' && 'Müşteri Analizi'}
                  {selectedReport === 'inventory' && 'Stok Raporu'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDownloadReport(selectedReport)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  İndir
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : (
                getReportContent(selectedReport)
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bu Ayki Ciro</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺{reportData.salesData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString('tr-TR')}
                  </p>
                  <p className="text-sm text-green-600">+12.5%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Sipariş</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.salesData.reduce((sum, item) => sum + item.orders, 0)}
                  </p>
                  <p className="text-sm text-green-600">+8.3%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ortalama Sepet</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₺{Math.round(
                      reportData.salesData.reduce((sum, item) => sum + item.revenue, 0) / 
                      Math.max(reportData.salesData.reduce((sum, item) => sum + item.orders, 0), 1)
                    ).toLocaleString('tr-TR')}
                  </p>
                  <p className="text-sm text-red-600">-2.1%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Müşteri</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.customerAnalytics?.totalCustomers || 0}
                  </p>
                  <p className="text-sm text-green-600">+15.7%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}