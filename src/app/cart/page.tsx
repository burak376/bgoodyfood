'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, Trash2, ShoppingBag, Truck, Shield, CreditCard, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { AuthSidebar } from '@/components/auth-sidebar'
import { useToast } from '@/hooks/use-toast'

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Organik Elma',
      price: 32.50,
      originalPrice: 45.00,
      quantity: 2,
      image: '/products/apple.jpg',
      inStock: true,
      maxStock: 50,
      description: '1kg',
      discount: 28
    },
    {
      id: '2',
      name: 'Doğal Domates',
      price: 18.90,
      originalPrice: null,
      quantity: 3,
      image: '/products/vegetables.jpg',
      inStock: true,
      maxStock: 30,
      description: '1kg',
      discount: 0
    },
    {
      id: '3',
      name: 'Organik Nohut',
      price: 28.50,
      originalPrice: null,
      quantity: 1,
      image: '/products/vegetables.jpg',
      inStock: true,
      maxStock: 25,
      description: '500gr',
      discount: 0
    }
  ])

  const [isAuthSidebarOpen, setIsAuthSidebarOpen] = useState(false)
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()

  const [checkoutData, setCheckoutData] = useState({
    shipping: 'standard',
    payment: 'credit_card',
    address: '',
    city: '',
    phone: '',
    notes: ''
  })

  const updateQuantity = (id: string, newQuantity: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const quantity = Math.max(1, Math.min(newQuantity, item.maxStock))
        return { ...item, quantity }
      }
      return item
    }))
  }

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal >= 150 ? 0 : 19.90
  const total = subtotal + shipping

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Giriş Gerekli",
        description: "Sipariş vermek için lütfen giriş yapın veya üye olun.",
        variant: "destructive",
      })
      setIsAuthSidebarOpen(true)
      return
    }

    // Proceed with checkout
    toast({
      title: "Sipariş Alınıyor",
      description: "Siparişiniz işleniyor...",
    })
    
    // In a real app, this would process the order
    setTimeout(() => {
      toast({
        title: "Sipariş Başarılı!",
        description: "Siparişiniz başarıyla oluşturuldu.",
      })
    }, 2000)
  }

  const shippingOptions = [
    { id: 'standard', name: 'Standart Kargo', price: 19.90, days: '2-3 iş günü' },
    { id: 'express', name: 'Express Kargo', price: 29.90, days: '1 iş günü' },
    { id: 'same_day', name: 'Aynı Gün Teslimat', price: 39.90, days: 'Bugün' }
  ]

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-20">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 relative">
                  <img src="/logo.png" alt="BGoodyFood" className="w-full h-full object-contain" />
                </div>
                <div>
                  <span className="text-xl font-light text-gray-900">BGoody</span>
                  <span className="text-xl font-semibold text-green-600">Food</span>
                </div>
              </Link>

              <Link href="/products" className="text-gray-700 hover:text-green-600 transition font-medium">
                Alışverişe Devam Et
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sepetiniz Boş</h1>
            <p className="text-gray-600 text-lg mb-8">
              Henüz sepetinize ürün eklemediniz. Sağlıklı ve organik ürünlerimizi keşfetmek için alışverişe başlayın.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg font-semibold">
                Alışverişe Başla
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 relative">
                <img src="/logo.png" alt="BGoodyFood" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-light text-gray-900">BGoody</span>
                <span className="text-xl font-semibold text-green-600">Food</span>
              </div>
            </Link>

            <Link href="/products" className="text-gray-700 hover:text-green-600 transition font-medium">
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-green-600 transition">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Alışveriş Sepeti</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Alışveriş Sepeti</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <Card key={item.id} className="overflow-hidden border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-green-600">₺{item.price}</span>
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">₺{item.originalPrice}</span>
                          )}
                          {item.discount > 0 && (
                            <Badge className="bg-red-100 text-red-700 text-xs">
                              -%{item.discount}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.inStock ? (
                            <Badge className="bg-green-100 text-green-800 text-xs">Stokta</Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 text-xs">Stokta Yok</Badge>
                          )}
                          <span className="text-xs text-gray-500">({item.maxStock} adet)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center font-semibold text-lg">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxStock}
                            className="h-8 w-8"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            ₺{(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              ₺{(item.originalPrice * item.quantity).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Promo Code */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="promo" className="text-sm font-medium text-gray-700 mb-2 block">
                      İndirim Kodu
                    </Label>
                    <Input
                      id="promo"
                      placeholder="İndirim kodu giriniz"
                      className="h-12"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button variant="outline" className="px-8 h-12">
                      Uygula
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Ara Toplam</span>
                    <span className="font-medium text-gray-900">₺{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Kargo</span>
                    <span className="font-medium text-gray-900">
                      {shipping === 0 ? (
                        <span className="text-green-600">Ücretsiz</span>
                      ) : (
                        `₺${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {subtotal < 150 && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">Kargo Bedava!</span> ₺{(150 - subtotal).toFixed(2)} daha ekleyin ve ücretsiz kargo kazanın.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam</span>
                    <span className="text-green-600 text-2xl">₺{total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Options */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Teslimat Seçenekleri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {shippingOptions.map((option) => (
                  <div key={option.id} className="flex items-center justify-between p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={checkoutData.shipping === option.id}
                        onChange={(e) => setCheckoutData(prev => ({ ...prev, shipping: e.target.value }))}
                        className="text-green-600 focus:ring-green-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{option.name}</div>
                        <div className="text-sm text-gray-500">{option.days}</div>
                      </div>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {option.price === 0 ? 'Ücretsiz' : `₺${option.price}`}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Ödeme Yöntemi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="credit_card"
                    checked={checkoutData.payment === 'credit_card'}
                    onChange={(e) => setCheckoutData(prev => ({ ...prev, payment: e.target.value }))}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Kredi Kartı</span>
                </div>
                <div className="flex items-center space-x-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="cash_on_delivery"
                    checked={checkoutData.payment === 'cash_on_delivery'}
                    onChange={(e) => setCheckoutData(prev => ({ ...prev, payment: e.target.value }))}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <Truck className="w-5 h-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Kapıda Ödeme</span>
                </div>
              </CardContent>
            </Card>

            {/* Checkout Button */}
            <Button 
              size="lg" 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold"
              onClick={handleCheckout}
            >
              {isAuthenticated ? 'Siparişi Tamamla' : 'Giriş Yap ve Sipariş Ver'}
            </Button>

            {/* User Info */}
            {isAuthenticated && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">{user?.name}</p>
                    <p className="text-xs text-green-600">{user?.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Güvenli Alışveriş</span>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Sidebar */}
      <AuthSidebar 
        isOpen={isAuthSidebarOpen} 
        onClose={() => setIsAuthSidebarOpen(false)} 
      />
    </div>
  )
}