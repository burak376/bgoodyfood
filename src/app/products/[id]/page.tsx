'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShoppingCart, Star, Truck, Shield, Leaf, Heart, Minus, Plus, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  // Mock product data
  const product = {
    id: '1',
    name: 'Organik Elma',
    price: 32.50,
    originalPrice: 45.00,
    description: 'Türkiye\'nin en verimli topraklarında yetiştirilen organik elmalarımız, hiçbir kimyasal gübre veya pestisit kullanılmadan üretilmektedir. Vitamin ve mineral açısından zengin olan bu elmalar, hem sağlıklı hem de lezzetli bir atıştırmalık alternatifidir.',
    images: [
      '/products/apple.jpg',
      '/products/apple.jpg',
      '/products/apple.jpg',
      '/products/apple.jpg'
    ],
    category: 'Meyveler',
    badge: 'İNDİRİM',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    isOrganic: true,
    stock: 50,
    sku: 'ORG-ELMA-001',
    nutrition: {
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fiber: 2.4,
      fat: 0.2
    },
    features: [
      '%100 Organik',
      'GDO İçermez',
      'Vitamin A ve C açısından zengin',
      'Lif kaynağı',
      'Kolesterol içermez'
    ],
    discount: 28
  }

  const relatedProducts = [
    {
      id: '2',
      name: 'Organik Portakal',
      price: 28.90,
      image: '/products/apple.jpg',
      rating: 4.5,
      reviews: 45,
      description: '1kg'
    },
    {
      id: '3',
      name: 'Organik Armut',
      price: 35.50,
      image: '/products/apple.jpg',
      rating: 4.7,
      reviews: 67,
      description: '1kg'
    },
    {
      id: '4',
      name: 'Organik Mandalina',
      price: 26.90,
      image: '/products/apple.jpg',
      rating: 4.6,
      reviews: 89,
      description: '1kg'
    },
    {
      id: '5',
      name: 'Organik Greyfurt',
      price: 24.90,
      image: '/products/apple.jpg',
      rating: 4.4,
      reviews: 34,
      description: '1kg'
    }
  ]

  const reviews = [
    {
      id: '1',
      user: 'Ayşe Y.',
      rating: 5,
      date: '2 gün önce',
      comment: 'Gerçekten çok lezzetli ve taze ürünler. Organik olduğunu hissediyorsunuz. Kesinlikle tavsiye ederim.'
    },
    {
      id: '2',
      user: 'Mehmet K.',
      rating: 4,
      date: '1 hafta önce',
      comment: 'Kaliteli ürün, fiyatı biraz yüksek ama organik olduğu için değer. Paketleme de güzeldi.'
    },
    {
      id: '3',
      user: 'Zeynep A.',
      rating: 5,
      date: '2 hafta önce',
      comment: 'Çocuklarım için organik ürün ararken buldum. Hem ben hem çocuklarım çok sevdi.'
    }
  ]

  const addToCart = () => {
    setCartCount(prev => prev + quantity)
    // TODO: Implement cart functionality
  }

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Sophisticated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-100/30 to-emerald-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-teal-100/20 rounded-full blur-3xl"></div>
      </div>

      {/* Modern Navigation Header */}
      <header className="sticky top-0 z-50 glass-morphism shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BGoody</span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="relative group">
                <Button variant="ghost" size="sm" className="hover:bg-green-50 transition-colors duration-200 rounded-full">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-green-600 transition">Ana Sayfa</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/products" className="hover:text-green-600 transition">Ürünler</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl overflow-hidden shadow-xl">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                    selectedImage === index ? 'border-green-600 scale-105 shadow-lg' : 'border-transparent hover:border-green-300'
                  }`}
                >
                  <img 
                    src={product.images[index]} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                {product.badge && (
                  <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-none">
                    {product.badge}
                  </Badge>
                )}
                {product.discount > 0 && (
                  <Badge className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-none">
                    -%{product.discount}
                  </Badge>
                )}
                {product.isOrganic && (
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-100 hover:to-emerald-100 border-green-200">
                    <Leaf className="w-3 h-3 mr-1" />
                    Organik
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">{product.rating}</span>
                <span className="text-gray-500">({product.reviews} değerlendirme)</span>
              </div>

              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">₺{product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">₺{product.originalPrice}</span>
                )}
              </div>

              <p className="text-lg text-gray-600 leading-relaxed mb-8">{product.description}</p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <span className="text-gray-700 font-medium">Adet:</span>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-12 w-12 border-green-200 hover:bg-green-50 hover:border-green-300 rounded-full"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="h-12 w-12 border-green-200 hover:bg-green-50 hover:border-green-300 rounded-full"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.stock} adet stokta)
                </span>
              </div>

              <div className="flex space-x-4">
                <Button
                  size="lg"
                  onClick={addToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="h-14 w-14 border-green-200 hover:bg-green-50 hover:border-green-300 rounded-full"
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-green-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Aynı Gün Kargo</h4>
                <p className="text-sm text-gray-600">15:00'e kadar</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Güvenli Alışveriş</h4>
                <p className="text-sm text-gray-600">%100 Koruma</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Organik Sertifikalı</h4>
                <p className="text-sm text-gray-600">Garanti</p>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-green-100">
              <h4 className="font-semibold text-gray-900 text-lg">Ürün Özellikleri:</h4>
              <div className="grid grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-green-50 to-emerald-50 p-1 border border-green-100">
              <TabsTrigger value="description" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg">
                Ürün Açıklaması
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg">
                Besin Değerleri
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg">
                Değerlendirmeler
              </TabsTrigger>
              <TabsTrigger value="shipping" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg">
                Kargo & İade
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900">Ürün Hakkında</h3>
                  <div className="prose max-w-none text-gray-600">
                    <p className="text-lg leading-relaxed mb-6">
                      {product.description}
                    </p>
                    <p className="text-lg leading-relaxed mb-6">
                      Organik tarım yöntemleriyle yetiştirilen ürünlerimiz, toprağın doğal dengesini korurken 
                      size en saf ve en sağlıklı formunu sunar. Hiçbir kimyasal müdahale olmadan büyüyen bu 
                      ürünler, vücudunuzun ihtiyaç duyduğu vitamin ve mineralleri doğal yollarla almanızı sağlar.
                    </p>
                    <p className="text-lg leading-relaxed">
                      Depolama koşulları: Serin ve kuru yerde muhafaza ediniz. Direkt güneş ışığından koruyunuz.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="mt-8">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900">Besin Değerleri (100g)</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-green-100">
                        <span className="text-gray-600 font-medium">Kalori</span>
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">{product.nutrition.calories} kcal</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-green-100">
                        <span className="text-gray-600 font-medium">Protein</span>
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">{product.nutrition.protein}g</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-green-100">
                        <span className="text-gray-600 font-medium">Karbonhidrat</span>
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">{product.nutrition.carbs}g</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-green-100">
                        <span className="text-gray-600 font-medium">Lif</span>
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">{product.nutrition.fiber}g</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-green-100">
                        <span className="text-gray-600 font-medium">Yağ</span>
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">{product.nutrition.fat}g</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-green-100">
                        <span className="text-gray-600 font-medium">Kolesterol</span>
                        <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">0mg</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-semibold">Müşteri Değerlendirmeleri</h3>
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                      Değerlendirme Yaz
                    </Button>
                  </div>
                  
                  <div className="space-y-8">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-8 last:border-b-0">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="font-semibold text-gray-900">{review.user}</span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 text-lg leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-8">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-6">Kargo ve İade Politikası</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-4">Kargo</h4>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          Siparişleriniz 1-3 iş günü içinde kargoya verilir.
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          150 TL ve üzeri alışverişlerde kargo ücretsizdir.
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          Organik ürünlerin tazeliğini korumak için özel ambalaj kullanılır.
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg mb-4">İade</h4>
                      <ul className="space-y-3 text-gray-600">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          Ürünleri teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz.
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          Ürünlerin ambalajı açılmamış ve kullanılmamış olmalıdır.
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          Bozuk veya yanlış ürün gönderimi durumunda ücretsiz değişim yapılır.
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Benzer Ürünler</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/90 hover:bg-white text-gray-700 hover:text-red-500"
                      >
                        <Heart className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">{relatedProduct.description}</p>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(relatedProduct.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {relatedProduct.rating} ({relatedProduct.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        ₺{relatedProduct.price}
                      </span>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}