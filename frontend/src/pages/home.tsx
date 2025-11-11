'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Search, Menu, X, Star, Shield, Leaf, ChevronRight, Sparkles, Heart, Loader2, Check, Zap, Droplets, Sun, Globe, Users, Award, Clock, MapPin, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { CategoryLink } from '@/components/category-link'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set())
  const [activeProductCard, setActiveProductCard] = useState<string | null>(null)
  const { toast } = useToast()

  // Creative product data with enhanced details
  const featuredProducts = [
    {
      id: '1',
      name: 'Organik Elma',
      price: 32.50,
      originalPrice: 45.00,
      image: '/products/apple.jpg',
      badge: 'YENİ',
      rating: 4.8,
      reviews: 124,
      description: '1kg',
      inStock: true,
      tagline: 'Crunchy & Sweet',
      color: 'from-red-400 to-pink-500'
    },
    {
      id: '2',
      name: 'Doğal Bal',
      price: 89.90,
      image: '/products/honey.jpg',
      badge: 'POPÜLER',
      rating: 4.9,
      reviews: 89,
      description: '500gr',
      inStock: true,
      tagline: 'Golden Nectar',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      id: '3',
      name: 'Organik Zeytinyağı',
      price: 149.90,
      originalPrice: 189.90,
      image: '/products/olive-oil.jpg',
      badge: 'SATIŞ LİDERİ',
      rating: 5.0,
      reviews: 256,
      description: '750ml',
      inStock: true,
      tagline: 'Liquid Gold',
      color: 'from-green-400 to-emerald-500'
    },
    {
      id: '4',
      name: 'Taze Organik Sebzeler',
      price: 45.50,
      image: '/products/vegetables.jpg',
      badge: 'TAZE',
      rating: 4.7,
      reviews: 67,
      description: 'Karışık',
      inStock: true,
      tagline: 'Garden Fresh',
      color: 'from-green-500 to-teal-600'
    }
  ]

  // Enhanced categories with beautiful icons
  const categories = [
    { 
      name: 'Meyveler', 
      icon: '/icons/fruits-icon.png',
      slug: 'meyveler',
      count: 45,
      gradient: 'from-orange-400 to-red-500',
      description: 'Güneşin tadı'
    },
    { 
      name: 'Sebzeler', 
      icon: '/icons/vegetables-icon.png',
      slug: 'sebzeler',
      count: 38,
      gradient: 'from-green-400 to-emerald-500',
      description: 'Toprağın gücü'
    },
    { 
      name: 'Bakliyat', 
      icon: '/icons/legumes-icon.png',
      slug: 'bakliyat',
      count: 52,
      gradient: 'from-amber-400 to-yellow-500',
      description: 'Enerji deposu'
    },
    { 
      name: 'Süt Ürünleri', 
      icon: '/icons/dairy-icon.png',
      slug: 'sut-urunleri',
      count: 28,
      gradient: 'from-blue-400 to-indigo-500',
      description: 'Sağlık kaynağı'
    },
    { 
      name: 'Et & Tavuk', 
      icon: '/icons/meat-icon.png',
      slug: 'et-tavuk',
      count: 31,
      gradient: 'from-red-500 to-pink-500',
      description: 'Protein zengini'
    },
    { 
      name: 'Bal & Reçel', 
      icon: '/icons/honey-icon.png',
      slug: 'bal-recel',
      count: 24,
      gradient: 'from-purple-400 to-pink-500',
      description: 'Tatlı anlar'
    }
  ]

  const addToCart = async (productId: string, productName: string) => {
    setLoadingProducts(prev => new Set(prev).add(productId))
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoadingProducts(prev => {
      const newSet = new Set(prev)
      newSet.delete(productId)
      return newSet
    })
    setCartCount(prev => prev + 1)
    toast({
      title: "🎉 Ürün Sepete Eklendi!",
      description: `${productName} başarılı bir şekilde sepetinize eklendi.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Creative Hero Section with Dynamic Layout */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full filter blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Creative Grid Layout */}
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-7 space-y-8">
                {/* Floating Badge */}
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full px-6 py-3 text-sm font-semibold border border-green-200 backdrop-blur-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <Sparkles className="w-4 h-4" />
                  <span>Yeni Sezon Ürünleri Geldi!</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
                
                {/* Creative Title */}
                <div className="space-y-4">
                  <h1 className="text-6xl lg:text-8xl font-bold leading-tight">
                    <span className="text-gray-900">Organik</span>
                    <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Yaşam</span>
                    <span className="text-gray-900">Tarzı</span>
                  </h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-2">
                      {[Globe, Users, Award].map((Icon, index) => (
                        <div key={index} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-green-100">
                          <Icon className="w-5 h-5 text-green-600" />
                        </div>
                      ))}
                    </div>
                    <span className="text-gray-600 font-medium">50K+ Mutlu Müşteri</span>
                  </div>
                </div>
                
                {/* Enhanced Description */}
                <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                  Doğadan gelen taze ve organik ürünlerle sağlıklı bir yaşam başlangıcı. 
                  <span className="font-semibold text-green-600"> Kalite, güven ve lezzet</span> bir arada.
                </p>
                
                {/* Creative CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/products">
                    <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Alışverişe Başla
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300">
                    <Heart className="w-5 h-5 mr-2" />
                    Katalog İndir
                  </Button>
                </div>
                
                {/* Enhanced Stats - Better Design */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  {[
                    { 
                      icon: Clock, 
                      title: 'Aynı Gün Teslimat', 
                      description: 'Saat 15:00\'e kadar verilen siparişler',
                      color: 'text-blue-600'
                    },
                    { 
                      icon: MapPin, 
                      title: 'Türkiye\'nin Her Yeri', 
                      description: 'Ücretsiz kargo 150 TL ve üzeri',
                      color: 'text-green-600'
                    },
                    { 
                      icon: CheckCircle, 
                      title: '%100 Memnuniyet', 
                      description: '15 gün iade garantisi',
                      color: 'text-purple-600'
                    }
                  ].map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 mb-1">{stat.title}</div>
                      <div className="text-xs text-gray-600 leading-tight">{stat.description}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Creative Visual - Right Side */}
              <div className="lg:col-span-5 relative">
                <div className="relative">
                  {/* Main Image Card */}
                  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
                    <div className="aspect-square">
                      <img 
                        src="/hero-bg.jpg" 
                        alt="Organik Ürünler" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-6 right-6 animate-bounce">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-green-100">
                        <div className="flex items-center space-x-2">
                          <Sun className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-semibold text-gray-800">Taze Ürünler</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-6 left-6">
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl px-6 py-4 shadow-xl">
                        <div className="text-2xl font-bold">%100</div>
                        <div className="text-sm opacity-90">Organik Garantisi</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="py-20 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 relative overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-400 to-emerald-500"></div>
          <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full filter blur-3xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          {/* Enhanced Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full px-6 py-3 text-sm font-semibold mb-6 shadow-lg">
              <Leaf className="w-5 h-5" />
              <span>Doğal Lezzetler Dünyası</span>
              <ChevronRight className="w-4 h-4" />
            </div>
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Özenle Seçilmiş
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Kategoriler</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Her bir kategori, doğanın en saf haliyle size özel olarak seçilmiştir. 
              <span className="font-semibold text-green-600"> %100 organik sertifikalı</span> ürünlerle sağlıklı bir yaşam başlangıcı.
            </p>
          </div>
          
          {/* Enhanced Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {categories.map((category, index) => (
              <CategoryLink
                key={category.slug}
                name={category.name}
                icon={category.icon}
                slug={category.slug}
                count={category.count}
                gradient={category.gradient}
                description={category.description}
              />
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className="text-center">
            <Link to="/categories">
              <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl px-8 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Sparkles className="w-5 h-5" />
                <span className="font-semibold">Tüm Kategorileri Keşfet</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Creative Products Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 rounded-full px-4 py-2 text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>Öne Çıkan</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Popüler
              <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"> Ürünler</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Müşterilerimizin en çok sevdiği organik lezzetler
            </p>
          </div>
          
          {/* Creative Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative"
                onMouseEnter={() => setActiveProductCard(product.id)}
                onMouseLeave={() => setActiveProductCard(null)}
              >
                <Card className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 transform hover:-translate-y-2">
                  <div className="relative">
                    {/* Product Image */}
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {product.badge}
                        </Badge>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className={`absolute top-4 right-4 space-y-2 transition-all duration-300 ${activeProductCard === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                        <Button size="icon" className="w-10 h-10 bg-white rounded-full shadow-lg hover:bg-gray-50">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </Button>
                      </div>
                      
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    </div>
                    
                    {/* Product Info */}
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.tagline}</p>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({product.reviews})</span>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-gray-900">₺{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">₺{product.originalPrice}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{product.description}</p>
                          </div>
                        </div>
                        
                        {/* Add to Cart Button */}
                        <Button 
                          onClick={() => addToCart(product.id, product.name)}
                          disabled={loadingProducts.has(product.id)}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                        >
                          {loadingProducts.has(product.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <ShoppingCart className="w-4 h-4 mr-2" />
                          )}
                          {loadingProducts.has(product.id) ? 'Ekleniyor...' : 'Sepete Ekle'}
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          
          {/* View All Products CTA */}
          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="outline" size="lg" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300">
                Tüm Ürünleri Gör
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}