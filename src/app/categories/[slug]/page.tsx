'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShoppingCart, Search, Star, Grid, List, Heart, ArrowLeft, Filter, Sparkles, Leaf, Sun, Droplets, Shield, Zap, ChevronRight, Truck } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [cartCount, setCartCount] = useState(0)
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set())
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const { toast } = useToast()

  // Enhanced category data
  const categoryData: Record<string, { 
    name: string; 
    description: string; 
    image: string; 
    icon: any;
    gradient: string;
    tagline: string;
    stats: { label: string; value: string }[];
  }> = {
    'meyveler': {
      name: 'Meyveler',
      description: 'Güneşin ve toprağın buluştuğu, vitamin dolu organik meyveler. Her bir meyve, doğanın en saf haliyle size özel olarak seçilmiştir.',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&h=600&fit=crop',
      icon: Sun,
      gradient: 'from-orange-400 to-red-500',
      tagline: 'Güneşin Tatlı Hediyesi',
      stats: [
        { label: 'Ürün Çeşidi', value: '45+' },
        { label: 'Vitamin A', value: 'Yüksek' },
        { label: 'Taze Seviyesi', value: '%100' }
      ]
    },
    'sebzeler': {
      name: 'Sebzeler',
      description: 'Toprağın gücüyle yetişen, kimyasalsız organik sebzeler. Sağlıklı yaşam için en doğal seçim.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&h=600&fit=crop',
      icon: Leaf,
      gradient: 'from-green-400 to-emerald-500',
      tagline: 'Toprağın Gücü',
      stats: [
        { label: 'Ürün Çeşidi', value: '38+' },
        { label: 'Lif Oranı', value: 'Yüksek' },
        { label: 'Organik Sertifikalı', value: '%100' }
      ]
    },
    'bakliyat': {
      name: 'Bakliyat',
      description: 'Protein ve lif deposu organik bakliyat ürünleri. Vejetaryen ve vegan beslenmenin vazgeçilmezi.',
      image: 'https://images.unsplash.com/photo-1516684732162-798a006ffa66?w=1200&h=600&fit=crop',
      icon: Droplets,
      gradient: 'from-amber-400 to-yellow-500',
      tagline: 'Enerji Deposu',
      stats: [
        { label: 'Ürün Çeşidi', value: '52+' },
        { label: 'Protein', value: 'Yüksek' },
        { label: 'Glutensiz Seçenek', value: 'Var' }
      ]
    },
    'sut-urunleri': {
      name: 'Süt Ürünleri',
      description: 'Günlük sağım taze süt ve doğal süt ürünleri. Sağlıklı büyüme ve gelişim için.',
      image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1200&h=600&fit=crop',
      icon: Shield,
      gradient: 'from-blue-400 to-indigo-500',
      tagline: 'Sağlık Kaynağı',
      stats: [
        { label: 'Ürün Çeşidi', value: '28+' },
        { label: 'Kalsiyum', value: 'Zengin' },
        { label: 'Pastörize', value: '%100' }
      ]
    },
    'et-tavuk': {
      name: 'Et & Tavuk',
      description: 'Serbest gezen hayvanlardan elde edilen organik et ve tavuk ürünleri. Protein zengini sağlıklı seçimler.',
      image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=1200&h=600&fit=crop',
      icon: Zap,
      gradient: 'from-red-500 to-pink-500',
      tagline: 'Protein Zengini',
      stats: [
        { label: 'Ürün Çeşidi', value: '31+' },
        { label: 'Protein', value: 'Yüksek' },
        { label: 'Helal Sertifikalı', value: '%100' }
      ]
    },
    'bal-recel': {
      name: 'Bal & Reçel',
      description: 'Katkısız doğal bal ve ev yapımı reçeller. Kahvaltılarınızı tatlandıracak sağlıklı lezzetler.',
      image: 'https://images.unsplash.com/photo-1587049352846-2a36e6939dc2?w=1200&h=600&fit=crop',
      icon: Heart,
      gradient: 'from-purple-400 to-pink-500',
      tagline: 'Tatlı Anlar',
      stats: [
        { label: 'Ürün Çeşidi', value: '24+' },
        { label: 'Şeker Oranı', value: 'Doğal' },
        { label: 'Katkısız', value: '%100' }
      ]
    }
  }

  const category = categoryData[slug] || { 
    name: 'Kategori', 
    description: '', 
    image: '', 
    icon: Leaf,
    gradient: 'from-green-400 to-emerald-500',
    tagline: '',
    stats: []
  }
  const Icon = category.icon

  // Enhanced products for this category
  const products = [
    {
      id: '1',
      name: 'Organik Elma',
      price: 32.50,
      originalPrice: 45.00,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
      badge: 'İNDİRİM',
      rating: 4.8,
      reviews: 124,
      inStock: true,
      description: '1kg',
      discount: 28,
      tagline: 'Crunchy & Sweet',
      color: 'from-red-400 to-pink-500',
      features: ['Vitamin A', 'Lif', 'Antioksidan']
    },
    {
      id: '2',
      name: 'Organik Portakal',
      price: 28.90,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=400&fit=crop',
      badge: 'YENİ',
      rating: 4.5,
      reviews: 45,
      inStock: true,
      description: '1kg',
      discount: 0,
      tagline: 'Vitamin C Bombası',
      color: 'from-orange-400 to-yellow-500',
      features: ['Vitamin C', 'Folik Asit', 'Potasyum']
    },
    {
      id: '3',
      name: 'Organik Muz',
      price: 42.90,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
      badge: 'POPÜLER',
      rating: 4.7,
      reviews: 89,
      inStock: true,
      description: '1kg',
      discount: 0,
      tagline: 'Enerji Kaynağı',
      color: 'from-yellow-400 to-orange-500',
      features: ['Potasyum', 'B6 Vitamini', 'Lif']
    },
    {
      id: '4',
      name: 'Organik Çilek',
      price: 65.00,
      originalPrice: 85.00,
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop',
      badge: 'ÖZEL',
      rating: 4.9,
      reviews: 156,
      inStock: true,
      description: '500gr',
      discount: 24,
      tagline: 'Lezzet Şöleni',
      color: 'from-red-500 to-pink-500',
      features: ['C Vitamini', 'Manganez', 'Folat']
    },
    {
      id: '5',
      name: 'Organik Üzüm',
      price: 78.50,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&h=400&fit=crop',
      badge: 'TAZE',
      rating: 4.6,
      reviews: 67,
      inStock: true,
      description: '1kg',
      discount: 0,
      tagline: 'Baharatlı Tat',
      color: 'from-purple-400 to-indigo-500',
      features: ['Antioksidan', 'K Vitamini', 'Potasyum']
    },
    {
      id: '6',
      name: 'Organik Kiraz',
      price: 125.00,
      originalPrice: 145.00,
      image: 'https://images.unsplash.com/photo-1528821128474-27f963b062bf?w=400&h=400&fit=crop',
      badge: 'LİMİTED',
      rating: 5.0,
      reviews: 234,
      inStock: true,
      description: '500gr',
      discount: 14,
      tagline: 'Sezonun Vazgeçilmezi',
      color: 'from-red-600 to-pink-600',
      features: ['Antioksidan', 'C Vitamini', 'Lif']
    }
  ]

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

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
      {/* Creative Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-light text-gray-900">BGoody</span>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Food</span>
              </div>
            </Link>

            <div className="hidden lg:flex flex-1 max-w-2xl mx-12">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-500 transition-colors" />
                <Input
                  type="text"
                  placeholder={`🌿 ${category.name} kategorisinde ara...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 w-full h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl transition-all"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-10 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Link href="/cart" className="relative group">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-green-600 transition" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Category Hero */}
      <section className="relative h-80 lg:h-96 overflow-hidden">
        <div className="absolute inset-0">
          {category.image ? (
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to gradient if image fails to load
                e.currentTarget.style.display = 'none'
                e.currentTarget.parentElement?.classList.add(category.gradient)
              }}
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${category.gradient}`}></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
          {/* Animated overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20`}></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-3 mb-6">
              <Link href="/" className="text-white/80 hover:text-white transition flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Ana Sayfa
              </Link>
              <span className="text-white/60">/</span>
              <Link href="/categories" className="text-white/80 hover:text-white transition">
                Kategoriler
              </Link>
              <span className="text-white/60">/</span>
              <span className="text-white font-medium">{category.name}</span>
            </div>
            
            {/* Category Title */}
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-16 h-16 bg-gradient-to-br ${category.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {category.name}
                </h1>
                <p className="text-xl text-white/90 font-medium">
                  {category.tagline}
                </p>
              </div>
            </div>
            
            <p className="text-lg text-white/90 leading-relaxed max-w-2xl mb-8">
              {category.description}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-lg">
              {category.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Toolbar */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-gray-900 text-lg">{sortedProducts.length}</span> ürün bulundu
              </div>
              {searchQuery && (
                <Badge className="bg-green-100 text-green-800">
                  "{searchQuery}"
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Öne Çıkan</SelectItem>
                  <SelectItem value="price-low">Fiyat: Düşükten Yükseğe</SelectItem>
                  <SelectItem value="price-high">Fiyat: Yüksekten Düşüğe</SelectItem>
                  <SelectItem value="rating">En Yüksek Puan</SelectItem>
                  <SelectItem value="name">İsim (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ürün bulunamadı</h3>
            <p className="text-gray-600 mb-6">Aradığınız kriterlere uygun ürün bulunamadı.</p>
            <Button 
              onClick={() => setSearchQuery('')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Filtreyi Temizle
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
            : 'space-y-6'
          }>
            {sortedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden bg-white rounded-2xl transform hover:-translate-y-2">
                <CardContent className="p-0">
                  {viewMode === 'grid' ? (
                    /* Grid View */
                    <div>
                      <div className="relative">
                        <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              // Fallback to colored gradient if image fails to load
                              e.currentTarget.style.display = 'none'
                              const parent = e.currentTarget.parentElement
                              if (parent) {
                                parent.className = `w-full h-full bg-gradient-to-br ${product.color} flex items-center justify-center`
                                parent.innerHTML = `<div class="text-6xl">🍎</div>`
                              }
                            }}
                          />
                          {/* Gradient Overlay */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col space-y-2">
                          {product.badge && (
                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {product.badge}
                            </Badge>
                          )}
                          {product.discount > 0 && (
                            <Badge className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              -%{product.discount}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Quick Actions */}
                        <div className={`absolute top-4 right-4 space-y-2 transition-all duration-300 ${hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
                          >
                            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                          </Button>
                        </div>
                        
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">Stokta Yok</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6">
                        <Link href={`/product/${product.id}`} className="block mb-3">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-green-600 transition cursor-pointer">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500">{product.tagline}</p>
                        </Link>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.features.slice(0, 2).map((feature, index) => (
                            <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center mb-4">
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
                          <span className="text-sm text-gray-500 ml-2">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-2xl font-bold text-gray-900">
                              ₺{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through ml-2">
                                ₺{product.originalPrice}
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">{product.description}</span>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Link href={`/product/${product.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full border-green-600 text-green-600 hover:bg-green-50 rounded-xl py-3 font-semibold transition-all duration-300"
                            >
                              İncele
                            </Button>
                          </Link>
                          <Button
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl py-3 font-semibold transition-all duration-300 transform hover:scale-105"
                            onClick={() => addToCart(product.id, product.name)}
                            disabled={!product.inStock || loadingProducts.has(product.id)}
                            onMouseEnter={() => setHoveredProduct(product.id)}
                            onMouseLeave={() => setHoveredProduct(null)}
                          >
                            {loadingProducts.has(product.id) ? (
                              <>
                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Ekleniyor...
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {product.inStock ? 'Sepete Ekle' : 'Stokta Yok'}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* List View */
                    <div className="flex p-6">
                      <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mr-6 flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to colored gradient if image fails to load
                            e.currentTarget.style.display = 'none'
                            const parent = e.currentTarget.parentElement
                            if (parent) {
                              parent.className = `w-32 h-32 bg-gradient-to-br ${product.color} rounded-xl overflow-hidden mr-6 flex-shrink-0 flex items-center justify-center`
                              parent.innerHTML = `<div class="text-4xl">🍎</div>`
                            }
                          }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/product/${product.id}`} className="block">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition cursor-pointer">
                                  {product.name}
                                </h3>
                                {product.badge && (
                                  <Badge className="bg-green-600 text-xs">
                                    {product.badge}
                                  </Badge>
                                )}
                                {product.discount > 0 && (
                                  <Badge className="bg-red-600 text-xs">
                                    -%{product.discount}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mb-3">{product.tagline}</p>
                            </Link>
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
                              <span className="text-sm text-gray-500 ml-2">
                                {product.rating} ({product.reviews})
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="mb-2">
                              <span className="text-2xl font-bold text-gray-900">
                                ₺{product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  ₺{product.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Link href={`/product/${product.id}`}>
                                <Button
                                  variant="outline"
                                  className="border-green-600 text-green-600 hover:bg-green-50"
                                >
                                  İncele
                                </Button>
                              </Link>
                              <Button
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => addToCart(product.id, product.name)}
                                disabled={!product.inStock}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                Sepete Ekle
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}