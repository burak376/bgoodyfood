'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Save, 
  X, 
  ShoppingBag, 
  Heart, 
  Settings, 
  LogOut, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  RefreshCw, 
  Star, 
  Trash2, 
  Eye,
  Calendar,
  CreditCard,
  Bell,
  Globe,
  Shield,
  Award,
  TrendingUp,
  Map,
  Home,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { useCartStore } from '@/stores/cart-store'
import { AddressDialog } from '@/components/address-dialog'

interface ProfileData {
  id: string
  name: string
  email: string
  phone: string
  address: string
  avatar: string | null
  membershipType: string
  accountStatus: string
  joinDate: string
  totalOrders: number
  totalSpent: number
  savedAddresses: Array<{
    id: string
    title: string
    address: string
    isDefault: boolean
  }>
  preferences: {
    newsletter: boolean
    smsNotifications: boolean
    emailNotifications: boolean
    language: string
  }
}

interface Order {
  id: string
  orderNumber: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  deliveryAddress: string
  paymentMethod: string
  estimatedDelivery: string
  trackingNumber?: string
}

interface FavoriteProduct {
  id: string
  productId: string
  name: string
  price: number
  image: string
  rating: number
  reviews: number
  description: string
  inStock: boolean
  category: string
  addedDate: string
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const { addItem } = useCartStore()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  // Fetch profile data
  useEffect(() => {
    fetchProfileData()
    fetchOrders()
    fetchFavorites()
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await fetch('/api/addresses')
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error('Addresses fetch error:', error)
    }
  }

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address
        })
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        // Transform data if needed
        setOrders(data || [])
      }
    } catch (error) {
      console.error('Orders fetch error:', error)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data || [])
      }
    } catch (error) {
      console.error('Favorites fetch error:', error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setIsEditing(false)
        toast({
          title: "Profil Güncellendi",
          description: "Profil bilgileriniz başarıyla güncellendi.",
        })
        fetchProfileData()
      } else {
        throw new Error('Update failed')
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address
      })
    }
    setIsEditing(false)
  }

  const addToCart = async (product: FavoriteProduct) => {
    try {
      await addItem({
        id: product.productId,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description
      })
      toast({
        title: "🛒 Ürün Sepete Eklendi!",
        description: `${product.name} başarılı bir şekilde sepetinize eklendi.`,
      })
    } catch (error) {
      console.error('Cart error:', error)
      toast({
        title: "Hata",
        description: "Sepete eklenirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const removeFromFavorites = async (productId: string) => {
    try {
      const response = await fetch(`/api/favorites?productId=${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setFavorites(favorites.filter(fav => fav.productId !== productId))
        toast({
          title: "Favorilerden Kaldırıldı",
          description: "Ürün favorilerinizden kaldırıldı.",
        })
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Favorilerden kaldırılırken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { 
          label: 'Beklemede', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-4 h-4" />
        }
      case 'processing':
        return { 
          label: 'Hazırlanıyor', 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <RefreshCw className="w-4 h-4" />
        }
      case 'shipped':
        return { 
          label: 'Kargoda', 
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          icon: <Truck className="w-4 h-4" />
        }
      case 'delivered':
        return { 
          label: 'Teslim Edildi', 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-4 h-4" />
        }
      case 'cancelled':
        return { 
          label: 'İptal Edildi', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4" />
        }
      default:
        return { 
          label: 'Bilinmiyor', 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Clock className="w-4 h-4" />
        }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getMembershipBadge = (type: string) => {
    switch (type) {
      case 'premium':
        return (
          <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0">
            <Award className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        )
      case 'vip':
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <Award className="w-3 h-3 mr-1" />
            VIP
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Standart
          </Badge>
        )
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Giriş Yapmalısınız</h1>
          <p className="text-gray-600 mb-6">Profil sayfasını görüntülemek için giriş yapın.</p>
          <Link href="/?auth=true">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              Giriş Yap
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profilim</h1>
                <p className="text-gray-600">Hesap bilgilerinizi yönetin</p>
              </div>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => {
                  logout()
                  toast({
                    title: "Çıkış Yapıldı",
                    description: "Başarıyla çıkış yapıldı.",
                  })
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Çıkış Yap
              </Button>
            </div>
          </div>

          {/* Profile Overview Card */}
          <Card className="bg-white rounded-2xl shadow-lg border-0 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profileData?.avatar || ''} />
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-600 text-white text-2xl">
                      {profileData?.name?.charAt(0) || user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{profileData?.name || user.name}</h2>
                    {profileData && getMembershipBadge(profileData.membershipType)}
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Shield className="w-3 h-3 mr-1" />
                      {profileData.accountStatus === 'active' ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{profileData?.email || user.email}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{profileData?.totalOrders || 0}</p>
                      <p className="text-sm text-gray-600">Sipariş</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">₺{profileData?.totalSpent?.toFixed(0) || 0}</p>
                      <p className="text-sm text-gray-600">Toplam Harcama</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
                      <p className="text-sm text-gray-600">Favori</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">
                        {new Date(profileData?.joinDate || '2023-01-01').getFullYear()}
                      </p>
                      <p className="text-sm text-gray-600">Üyelik</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border-0 shadow-lg rounded-xl p-1">
              <TabsTrigger value="overview" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg">
                <User className="w-4 h-4 mr-2" />
                Genel Bakış
              </TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Siparişlerim
              </TabsTrigger>
              <TabsTrigger value="favorites" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg">
                <Heart className="w-4 h-4 mr-2" />
                Favorilerim
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-lg">
                <Settings className="w-4 h-4 mr-2" />
                Ayarlar
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                        <User className="w-5 h-5 mr-2 text-green-600" />
                        Kişisel Bilgiler
                      </CardTitle>
                      {!isEditing ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="border-green-200 text-green-600 hover:bg-green-50"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Düzenle
                        </Button>
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            className="border-gray-200 text-gray-600 hover:bg-gray-50"
                          >
                            <X className="w-4 h-4 mr-2" />
                            İptal
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveProfile}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Kaydet
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          Ad Soyad
                        </label>
                        {isEditing ? (
                          <Input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                          />
                        ) : (
                          <p className="text-gray-900">{profileData?.name || user.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          E-posta
                        </label>
                        {isEditing ? (
                          <Input
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            type="email"
                            className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                          />
                        ) : (
                          <p className="text-gray-900">{profileData?.email || user.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          Telefon
                        </label>
                        {isEditing ? (
                          <Input
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+90 555 555 55 55"
                            className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                          />
                        ) : (
                          <p className="text-gray-900">{profileData?.phone || 'Belirtilmemiş'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          Adres
                        </label>
                        {isEditing ? (
                          <Input
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Adresiniz"
                            className="border-gray-200 focus:border-green-500 focus:ring-green-500"
                          />
                        ) : (
                          <p className="text-gray-900">{profileData?.address || 'Belirtilmemiş'}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Saved Addresses */}
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                        <Map className="w-5 h-5 mr-2 text-green-600" />
                        Kayıtlı Adresler
                      </CardTitle>
                      <div className="text-sm text-gray-600">
                        {addresses.length} adres
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {addresses.length > 0 ? (
                      <div className="space-y-3">
                        {addresses.map((address) => (
                          <div key={address.id} className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  {address.isDefault ? <Home className="w-5 h-5 text-green-600" /> : <Briefcase className="w-5 h-5 text-green-600" />}
                                </div>
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium text-gray-900">{address.title}</h4>
                                    {address.isDefault && (
                                      <Badge className="bg-green-100 text-green-800 text-xs">Varsayılan</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Henüz kayıtlı adresiniz bulunmuyor</p>
                      </div>
                    )}
                    <AddressDialog 
                      onAddressUpdate={() => {
                        fetchAddresses()
                        fetchProfileData() // Update profile data to refresh saved addresses
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Bu Ay</p>
                        <p className="text-2xl font-bold">₺425.50</p>
                        <p className="text-green-100 text-xs mt-1">12 sipariş</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Puan</p>
                        <p className="text-2xl font-bold">2,450</p>
                        <p className="text-blue-100 text-xs mt-1">Bronz üye</p>
                      </div>
                      <Award className="w-8 h-8 text-blue-200" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">İndirim</p>
                        <p className="text-2xl font-bold">₺85</p>
                        <p className="text-purple-100 text-xs mt-1">Kazanılan</p>
                      </div>
                      <CreditCard className="w-8 h-8 text-purple-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Siparişlerim</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Package className="w-4 h-4" />
                  <span>Toplam {orders.length} sipariş</span>
                </div>
              </div>

              {orders.length === 0 ? (
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardContent className="p-12 text-center">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz siparişiniz bulunmuyor</h3>
                    <p className="text-gray-600 mb-6">Organik ürünlerimizi keşfetmek için alışverişe başlayın.</p>
                    <Link href="/products">
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        Alışverişe Başla
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const statusInfo = getStatusInfo(order.status)
                    return (
                      <Card key={order.id} className="hover:shadow-lg transition-all duration-300">
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
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                ₺{order.total.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">{order.items.length} ürün</p>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <h4 className="font-medium text-gray-900 mb-2">Sipariş Ürünleri</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                  <span className="text-gray-600">{item.name}</span>
                                  <span className="text-gray-900">{item.quantity} x ₺{item.price.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                              <p>Tahmini Teslimat: {formatDate(order.estimatedDelivery)}</p>
                              {order.trackingNumber && (
                                <p>Takip No: {order.trackingNumber}</p>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              Detay
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Favorilerim</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span>{favorites.length} favori ürün</span>
                </div>
              </div>

              {favorites.length === 0 ? (
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardContent className="p-12 text-center">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz favori ürününüz bulunmuyor</h3>
                    <p className="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilerinize ekleyin.</p>
                    <Link href="/products">
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        Ürünleri Keşfet
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                          onClick={() => removeFromFavorites(product.productId)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge className="bg-red-500 text-white">Stokta Yok</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          <p className="text-xs text-gray-500">{formatDate(product.addedDate)}</p>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                        
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-bold text-gray-900">₺{product.price}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product)}
                            disabled={!product.inStock}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Notification Settings */}
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-green-600" />
                      Bildirim Ayarları
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profileData?.preferences && (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">E-posta Bildirimleri</p>
                            <p className="text-sm text-gray-600">Promosyonlar ve kampanyalar hakkında e-posta alın</p>
                          </div>
                          <Button
                            variant={profileData.preferences.emailNotifications ? "default" : "outline"}
                            size="sm"
                            className={profileData.preferences.emailNotifications ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {profileData.preferences.emailNotifications ? "Açık" : "Kapalı"}
                          </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">SMS Bildirimleri</p>
                            <p className="text-sm text-gray-600">Sipariş durumunuz hakkında SMS alın</p>
                          </div>
                          <Button
                            variant={profileData.preferences.smsNotifications ? "default" : "outline"}
                            size="sm"
                            className={profileData.preferences.smsNotifications ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {profileData.preferences.smsNotifications ? "Açık" : "Kapalı"}
                          </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Bülten</p>
                            <p className="text-sm text-gray-600">Haftalık bülten ve organik yaşam ipuçları</p>
                          </div>
                          <Button
                            variant={profileData.preferences.newsletter ? "default" : "outline"}
                            size="sm"
                            className={profileData.preferences.newsletter ? "bg-green-600 hover:bg-green-700" : ""}
                          >
                            {profileData.preferences.newsletter ? "Abone" : "Abone Değil"}
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Account Settings */}
                <Card className="bg-white rounded-2xl shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-green-600" />
                      Hesap Ayarları
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Dil</p>
                        <p className="text-sm text-gray-600">Uygulama dilini değiştirin</p>
                      </div>
                      <select className="px-3 py-1 border border-gray-200 rounded-lg text-sm">
                        <option>Türkçe</option>
                        <option>English</option>
                      </select>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Parola Değiştir</p>
                        <p className="text-sm text-gray-600">Hesap parolanızı güncelleyin</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Değiştir
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">İki Faktörlü Doğrulama</p>
                        <p className="text-sm text-gray-600">Hesabınızı ekstra güvenlik ile koruyun</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Kur
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Danger Zone */}
              <Card className="bg-red-50 border-red-200">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-red-800">Tehlikeli Bölge</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-800">Hesabı Sil</p>
                      <p className="text-sm text-red-600">Hesabınızı ve tüm verilerinizi kalıcı olarak silin</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Hesabı Sil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}