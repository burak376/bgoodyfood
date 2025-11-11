'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Search, Filter, Eye, Edit, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import AdminLayout from '@/components/admin/admin-layout';
import { adminApi, Order } from '@/lib/api/admin';
import { fallbackOrders, orderStatuses } from '@/lib/api/fallback-data';

export default function AdminOrders() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(fallbackOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(fallbackOrders);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tümü');
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    loadOrders();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    // Filter orders based on search and status
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedStatus !== 'Tümü') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }
    
    setFilteredOrders(filtered);
  }, [orders, searchTerm, selectedStatus]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Try to load from .NET API first
      try {
        const apiOrders = await adminApi.getOrders();
        setOrders(apiOrders);
        setFilteredOrders(apiOrders);
        setApiConnected(true);
        console.log('✅ Orders loaded from .NET API');
      } catch (apiError) {
        console.log('⚠️ .NET API not available, using fallback data');
        
        // Fallback to existing API endpoints
        const response = await fetch('/api/admin/orders');
        if (response.ok) {
          const data = await response.json();
          const localOrders = data.orders || [];
          setOrders(localOrders);
          setFilteredOrders(localOrders);
        }
        setApiConnected(false);
      }
    } catch (error) {
      console.error('Orders loading error:', error);
      setOrders(fallbackOrders);
      setFilteredOrders(fallbackOrders);
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      if (apiConnected) {
        await adminApi.updateOrderStatus(orderId, newStatus);
      } else {
        // Fallback update logic
        console.log('Update order status:', orderId, newStatus);
      }
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    return statusConfig ? (
      <Badge className={statusConfig.color}>
        {statusConfig.label}
      </Badge>
    ) : (
      <Badge variant="outline">{status}</Badge>
    );
  };

  const getStatusColor = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    return statusConfig?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    return statusConfig?.label || status;
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <AdminLayout title="Yetkisiz Erişim" subtitle="Bu sayfaya erişim izniniz yok">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <Button onClick={() => router.push('/')}>Ana Sayfaya Dön</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout title="Sipariş Yönetimi" subtitle="Yükleniyor...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Sipariş Yönetimi" subtitle="Siparişleri yönet">
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
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Sipariş ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Tümü">Tüm Durumlar</option>
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrele
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Siparişler</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Bekleyen</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredOrders.filter(o => o.status === 'pending').length}</p>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Beklemede</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">İşlenen</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredOrders.filter(o => o.status === 'processing').length}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">İşleniyor</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Teslim Edilen</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredOrders.filter(o => o.status === 'delivered').length}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Teslim Edildi</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>Sipariş Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Sipariş No</th>
                    <th className="text-left py-3 px-4">Müşteri</th>
                    <th className="text-left py-3 px-4">Tarih</th>
                    <th className="text-left py-3 px-4">Toplam</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-left py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium">{order.orderNumber}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(order.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td className="py-3 px-4">₺{order.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Gör
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}