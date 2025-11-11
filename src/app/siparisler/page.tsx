'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  ArrowLeft, 
  Leaf, 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Calendar,
  Filter,
  Eye,
  Download,
  RefreshCw,
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: {
    id: string
    name: string
    quantity: number
    price: number
    image: string
  }[]
  deliveryAddress: string
  paymentMethod: string
  estimatedDelivery: string
  trackingNumber?: string
}

export default function SiparislerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { toast } = useToast()

  // Mock sipariş verileri
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 285.50,
      items: [
        { id: '1', name: 'Organik Elma (1kg)', quantity: 2, price: 45.00, image: '/products/elma.jpg' },
        { id: '2', name: 'Taze Domates (1kg)', quantity: 3, price: 35.00, image: '/products/domates.jpg' },
        { id: '3', name: 'Organik Süt (1L)', quantity: 4, price: 42.50, image: '/products/sut.jpg' }
      ],
      deliveryAddress: 'Mehmet Yılmaz, İstanbul, Kadıköy, Caferağa Mah. No:123',
      paymentMethod: 'Kredi Kartı',
      estimatedDelivery: '2024-01-16',
      trackingNumber: 'TR123456789'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-18',
      status: 'shipped',
      total: 156.75,
      items: [
        { id: '4', name: 'Organik Portakal (1kg)', quantity: 2, price: 38.00, image: '/products/portakal.jpg' },
        { id: '5', name: 'Taze Salatalık (1kg)', quantity: 1, price: 25.00, image: '/products/salatalik.jpg' },
        { id: '6', name: 'Organik Bal (500g)', quantity: 1, price: 55.75, image: '/products/bal.jpg' }
      ],
      deliveryAddress: 'Ayşe Demir, Ankara, Çankaya, Kızılay Mah. No:456',
      paymentMethod: 'Kapıda Ödeme',
      estimatedDelivery: '2024-01-20',
      trackingNumber: 'TR987654321'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-20',
      status: 'processing',
      total: 423.25,
      items: [
        { id: '7', name: 'Organik Tavuk (1kg)', quantity: 2, price: 85.00, image: '/products/tavuk.jpg' },
        { id: '8', name: 'Taze Ispanak (500g)', quantity: 2, price: 28.00, image: '/products/ispanak.jpg' },
        { id: '9', name: 'Organik Yoğurt (1kg)', quantity: 3, price: 65.00, image: '/products/yogurt.jpg' },
        { id: '10', name: 'Kuru Badem (250g)', quantity: 1, price: 32.25, image: '/products/badem.jpg' }
      ],
      deliveryAddress: 'Ali Kaya, İzmir, Bornova, Evka-3 Mah. No:789',
      paymentMethod: 'Havale/EFT',
      estimatedDelivery: '2024-01-22'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      date: '2024-01-22',
      status: 'pending',
      total: 198.00,
      items: [
        { id: '11', name: 'Organik Muz (1kg)', quantity: 2, price: 42.00, image: '/products/muz.jpg' },
        { id: '12', name: 'Taze Biber (1kg)', quantity: 1, price: 35.00, image: '/products/biber.jpg' },
        { id: '13', name: 'Organik Peynir (500g)', quantity: 1, price: 79.00, image: '/products/peynir.jpg' }
      ],
      deliveryAddress: 'Fatma Öztürk, Bursa, Osmangazi, Demirtaş Mah. No:321',
      paymentMethod: 'Kredi Kartı',
      estimatedDelivery: '2024-01-24'
    },
    {
      id: '5',
      orderNumber: 'ORD-2023-098',
      date: '2023-12-28',
      status: 'delivered',
      total: 312.40,
      items: [
        { id: '14', name: 'Organik Çilek (500g)', quantity: 2, price: 65.00, image: '/products/cilek.jpg' },
        { id: '15', name: 'Taze Patlıcan (1kg)', quantity: 2, price: 28.00, image: '/products/patlican.jpg' },
        { id: '16', name: 'Organik Zeytinyağı (500ml)', quantity: 1, price: 126.40, image: '/products/zeytinyagi.jpg' }
      ],
      deliveryAddress: 'Mustafa Çelik, Antalya, Muratpaşa, Konyaaltı Mah. No:654',
      paymentMethod: 'Kredi Kartı',
      estimatedDelivery: '2023-12-29',
      trackingNumber: 'TR456789123'
    },
    {
      id: '6',
      orderNumber: 'ORD-2023-097',
      date: '2023-12-25',
      status: 'cancelled',
      total: 145.00,
      items: [
        { id: '17', name: 'Organik Üzüm (1kg)', quantity: 1, price: 55.00, image: '/products/uzum.jpg' },
        { id: '18', name: 'Taze Marul (500g)', quantity: 2, price: 22.50, image: '/products/marul.jpg' },
        { id: '19', name: 'Organik Sade Yağ (250g)', quantity: 1, price: 45.00, image: '/products/yag.jpg' }
      ],
      deliveryAddress: 'Zeynep Aksoy, Adana, Seyhan, Çukurova Mah. No:987',
      paymentMethod: 'Kapıda Ödeme',
      estimatedDelivery: '2023-12-26'
    }
  ]

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Beklemede', 
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="w-4 h-4" />
        }
      case 'processing':
        return { 
          label: 'Hazırlanıyor', 
          color: 'bg-blue-100 text-blue-800',
          icon: <RefreshCw className="w-4 h-4" />
        }
      case 'shipped':
        return { 
          label: 'Kargoda', 
          color: 'bg-purple-100 text-purple-800',
          icon: <Truck className="w-4 h-4" />
        }
      case 'delivered':
        return { 
          label: 'Teslim Edildi', 
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />
        }
      case 'cancelled':
        return { 
          label: 'İptal Edildi', 
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="w-4 h-4" />
        }
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const activeOrders = filteredOrders.filter(order => 
    ['pending', 'processing', 'shipped'].includes(order.status)
  )
  const completedOrders = filteredOrders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="font-medium">Ana Sayfa</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Siparişlerim</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Sipariş ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 h-10 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-green-500 focus:ring-green-500/20"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Beklemede</option>
                <option value="processing">Hazırlanıyor</option>
                <option value="shipped">Kargoda</option>
                <option value="delivered">Teslim Edildi</option>
                <option value="cancelled">İptal Edildi</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Aktif Siparişler</p>
                    <p className="text-2xl font-bold">{activeOrders.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Teslim Edilen</p>
                    <p className="text-2xl font-bold">
                      {orders.filter(o => o.status === 'delivered').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Kargoda</p>
                    <p className="text-2xl font-bold">
                      {orders.filter(o => o.status === 'shipped').length}
                    </p>
                  </div>
                  <Truck className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-500 to-gray-600 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-100 text-sm">Toplam Sipariş</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-gray-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="w-6 h-6 text-blue-500 mr-2" />
                Aktif Siparişler
              </h2>
              <div className="space-y-4">
                {activeOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status)
                  return (
                    <Card key={order.id} className="hover:shadow-lg transition-all duration-300 border-blue-100">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {order.orderNumber}
                              </h3>
                              <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                            </div>
                            <Badge className={statusInfo.color}>
                              <div className="flex items-center space-x-1">
                                {statusInfo.icon}
                                <span>{statusInfo.label}</span>
                              </div>
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Detay
                            </Button>
                            {order.trackingNumber && (
                              <Button variant="outline" size="sm">
                                <Truck className="w-4 h-4 mr-1" />
                                Takip
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Sipariş Tutarı</p>
                            <p className="text-lg font-semibold text-gray-900">
                              ₺{order.total.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Ürün Sayısı</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {order.items.length} ürün
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Tahmini Teslimat</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {formatDate(order.estimatedDelivery)}
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span>Sipariş Alındı</span>
                            <span>Hazırlanıyor</span>
                            <span>Kargoda</span>
                            <span>Teslim Edildi</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: order.status === 'pending' ? '25%' :
                                       order.status === 'processing' ? '50%' :
                                       order.status === 'shipped' ? '75%' : '100%'
                              }}
                            ></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          )}

          {/* Completed Orders */}
          {completedOrders.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-6 h-6 text-gray-500 mr-2" />
                Geçmiş Siparişler
              </h2>
              <div className="space-y-4">
                {completedOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.status)
                  return (
                    <Card key={order.id} className="hover:shadow-lg transition-all duration-300 border-gray-100">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {order.orderNumber}
                              </h3>
                              <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                            </div>
                            <Badge className={statusInfo.color}>
                              <div className="flex items-center space-x-1">
                                {statusInfo.icon}
                                <span>{statusInfo.label}</span>
                              </div>
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Detay
                            </Button>
                            {order.status === 'delivered' && (
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-1" />
                                Fatura
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Tekrarla
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Sipariş Tutarı</p>
                            <p className="text-lg font-semibold text-gray-900">
                              ₺{order.total.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Ürün Sayısı</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {order.items.length} ürün
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Ödeme Yöntemi</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {order.paymentMethod}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </section>
          )}

          {/* No Orders */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sipariş Bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? `"${searchQuery}" için sipariş bulunamadı.` : 'Henüz siparişiniz bulunmuyor.'}
              </p>
              <div className="flex justify-center space-x-4">
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery('')}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Aramayı Temizle
                  </Button>
                )}
                <Link href="/products">
                  <Button variant="outline">
                    Alışverişe Başla
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Sipariş Detayı - {selectedOrder.orderNumber}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Sipariş Tarihi</p>
                  <p className="font-medium">{formatDate(selectedOrder.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Durum</p>
                  <Badge className={getStatusInfo(selectedOrder.status).color}>
                    {getStatusInfo(selectedOrder.status).label}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Ödeme Yöntemi</p>
                  <p className="font-medium">{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Tahmini Teslimat</p>
                  <p className="font-medium">{formatDate(selectedOrder.estimatedDelivery)}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Teslimat Adresi</p>
                <p className="font-medium">{selectedOrder.deliveryAddress}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Sipariş Ürünleri</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₺{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">Toplam Tutar</p>
                  <p className="text-xl font-bold text-green-600">
                    ₺{selectedOrder.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {selectedOrder.trackingNumber && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-1">Kargo Takip Numarası</p>
                  <p className="font-medium text-blue-900">{selectedOrder.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}