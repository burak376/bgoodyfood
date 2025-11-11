'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ArrowLeft, Grid, List, Star, ShoppingCart, Package, TrendingUp, Heart, Filter, ChevronRight, Sparkles, Leaf, Users, Truck, Shield } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function KategorilerPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { toast } = useToast()

  const categories = [
    { 
      name: 'Taze Meyveler', 
      icon: '🍎',
      slug: 'meyveler',
      count: 45,
      gradient: 'from-orange-400 via-red-400 to-pink-500',
      description: 'Güneşin tatlı hediyesi, vitamin dolu organik meyveler',
      products: ['Elma', 'Armut', 'Portakal', 'Muz', 'Çilek', 'Üzüm', 'Kiraz', 'Şeftali'],
      rating: 4.8,
      featured: true,
      color: 'orange',
      stats: { products: 45, rating: 4.8, organic: 100 }
    },
    { 
      name: 'Organik Sebzeler', 
      icon: '🥬',
      slug: 'sebzeler',
      count: 38,
      gradient: 'from-green-400 via-emerald-400 to-teal-500',
      description: 'Toprağın gücü, kimyasalsız taze sebzeler',
      products: ['Domates', 'Salatalık', 'Biber', 'Patlıcan', 'Ispanak', 'Marul', 'Brokoli'],
      rating: 4.9,
      featured: true,
      color: 'green',
      stats: { products: 38, rating: 4.9, organic: 100 }
    },
    { 
      name: 'Bakliyat', 
      icon: '🌾',
      slug: 'bakliyat',
      count: 52,
      gradient: 'from-amber-400 via-yellow-400 to-orange-500',
      description: 'Enerji deposu, protein zengini bakliyat çeşitleri',
      products: ['Nohut', 'Mercimek', 'Kuru Fasulye', 'Bulgur', 'Pirinç', 'Maş fasulyesi'],
      rating: 4.7,
      featured: false,
      color: 'amber',
      stats: { products: 52, rating: 4.7, organic: 100 }
    },
    { 
      name: 'Süt Ürünleri', 
      icon: '🥛',
      slug: 'sut-urunleri',
      count: 28,
      gradient: 'from-blue-400 via-indigo-400 to-purple-500',
      description: 'Günlük taze süt ve doğal süt ürünleri',
      products: ['Süt', 'Yoğurt', 'Peynir', 'Tereyağı', 'Kaymak', 'Ayran'],
      rating: 4.8,
      featured: false,
      color: 'blue',
      stats: { products: 28, rating: 4.8, organic: 100 }
    },
    { 
      name: 'Et & Tavuk', 
      icon: '🥩',
      slug: 'et-tavuk',
      count: 31,
      gradient: 'from-red-500 via-rose-500 to-pink-500',
      description: 'Serbest gezen hayvanlardan organik et ürünleri',
      products: ['Tavuk', 'Dana Et', 'Kuzu Et', 'Balık', 'Yumurta', 'Biftek'],
      rating: 4.9,
      featured: true,
      color: 'red',
      stats: { products: 31, rating: 4.9, organic: 100 }
    },
    { 
      name: 'Bal & Reçel', 
      icon: '🍯',
      slug: 'bal-recel',
      count: 24,
      gradient: 'from-purple-400 via-pink-400 to-rose-500',
      description: 'Doğal bal ve ev yapımı reçeller',
      products: ['Bal', 'Pekmez', 'Reçel', 'Marmelat', 'Helva', 'Pestil'],
      rating: 4.6,
      featured: false,
      color: 'purple',
      stats: { products: 24, rating: 4.6, organic: 100 }
    },
    { 
      name: 'Kuru Yemiş', 
      icon: '🌰',
      slug: 'kuru-yemis',
      count: 35,
      gradient: 'from-yellow-400 via-amber-400 to-orange-500',
      description: 'Sağlıklı atıştırmalık kuru yemiş çeşitleri',
      products: ['Badem', 'Ceviz', 'Fındık', 'Fıstık', 'Kaju', 'Leblebi'],
      rating: 4.7,
      featured: false,
      color: 'yellow',
      stats: { products: 35, rating: 4.7, organic: 100 }
    },
    { 
      name: 'Baharat & Yağ', 
      icon: '🫒',
      slug: 'baharat-yag',
      count: 42,
      gradient: 'from-green-500 via-teal-500 to-emerald-500',
      description: 'Lezzet sırları, doğal baharatlar ve yağlar',
      products: ['Zeytinyağı', 'Tuz', 'Karabiber', 'Kekik', 'Nane', 'Pul biber'],
      rating: 4.8,
      featured: false,
      color: 'teal',
      stats: { products: 42, rating: 4.8, organic: 100 }
    }
  ]

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const featuredCategories = categories.filter(cat => cat.featured)
  const regularCategories = categories.filter(cat => !cat.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/50 via-white to-emerald-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-3 text-green-600 hover:text-green-700 transition-colors group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium text-lg">Ana Sayfa</span>
              </Link>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-green-200 to-transparent"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Kategoriler
                  </h1>
                  <p className="text-sm text-gray-600">Organik ürünlerimiz</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Kategori ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 w-80 h-12 bg-gray-50/50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl transition-all"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-9 w-9 p-0 rounded-lg"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-9 w-9 p-0 rounded-lg"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Organik Yaşam
              <br />
              <span className="text-green-100">Kategorileri</span>
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed max-w-2xl mx-auto">
              %100 organik sertifikalı ürünlerle sağlıklı yaşamaya başlayın. 
              Taze, doğal ve katkısız ürünler kapınızda.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Package className="w-5 h-5" />
                <span className="font-semibold">200+ Ürün</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Star className="w-5 h-5" />
                <span className="font-semibold">4.8+ Puan</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Truck className="w-5 h-5" />
                <span className="font-semibold">Günlük Taze</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">%100 Organik</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Featured Categories */}
          {!searchQuery && featuredCategories.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">Öne Çıkan Kategoriler</h3>
                    <p className="text-gray-600 mt-1">En popüler organik ürünlerimiz</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Özel Seçim
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCategories.map((category) => (
                  <Link key={category.slug} href={`/categories/${category.slug}`} className="group block">
                    <Card className="group hover:shadow-2xl transition-all duration-700 border-0 bg-white overflow-hidden rounded-3xl transform hover:-translate-y-2 cursor-pointer">
                      <div className="relative h-56 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`}></div>
                        <div className="absolute inset-0 bg-black/10"></div>
                        
                        {/* Animated Pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 rounded-full"></div>
                          <div className="absolute top-12 right-8 w-6 h-6 bg-white/20 rounded-full"></div>
                          <div className="absolute bottom-8 left-12 w-4 h-4 bg-white/20 rounded-full"></div>
                          <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 rounded-full"></div>
                        </div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-7xl transform group-hover:scale-110 transition-transform duration-700 drop-shadow-lg">
                            {category.icon}
                          </div>
                        </div>
                        
                        <div className="absolute top-6 right-6">
                          <Badge className="bg-white/90 backdrop-blur-sm text-yellow-600 px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            {category.rating}
                          </Badge>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      
                      <CardContent className="p-8">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">{category.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{category.stats.products}</div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Ürün</div>
                            </div>
                            <div className="w-px h-8 bg-gray-200"></div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{category.stats.rating}</div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Puan</div>
                            </div>
                            <div className="w-px h-8 bg-gray-200"></div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{category.stats.organic}%</div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">Organik</div>
                            </div>
                          </div>
                        </div>

                        {/* Popular Products */}
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {category.products.slice(0, 4).map((product) => (
                              <Badge key={product} variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 rounded-full text-sm">
                                {product}
                              </Badge>
                            ))}
                            {category.products.length > 4 && (
                              <Badge variant="outline" className="border-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                                +{category.products.length - 4} ürün
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-green-600 font-semibold">
                            <span>Ürünleri İncele</span>
                            <ChevronRight className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" />
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <ShoppingCart className="w-4 h-4" />
                            <span>{category.count} ürün</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* All Categories */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Grid className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {searchQuery ? 'Arama Sonuçları' : 'Tüm Kategoriler'}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {searchQuery ? `"${searchQuery}" için` : ''} {filteredCategories.length} kategori bulundu
                  </p>
                </div>
              </div>
              
              {searchQuery && (
                <Button
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  className="border-gray-300 hover:border-gray-400"
                >
                  Aramayı Temizle
                </Button>
              )}
            </div>

            {/* Categories Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((category) => (
                  <Link key={category.slug} href={`/categories/${category.slug}`} className="group block">
                    <Card className="group hover:shadow-2xl transition-all duration-700 border-0 bg-white overflow-hidden rounded-2xl transform hover:-translate-y-1 cursor-pointer">
                      <div className="relative h-48 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`}></div>
                        <div className="absolute inset-0 bg-black/5"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-5xl transform group-hover:scale-110 transition-transform duration-700 drop-shadow-lg">
                            {category.icon}
                          </div>
                        </div>
                        
                        {category.featured && (
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Öne Çıkan
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                            {category.name}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{category.rating}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{category.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-500 font-medium">{category.count} ürün</span>
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                              %100 Organik
                            </Badge>
                          </div>
                        </div>

                        {/* Popular Products */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {category.products.slice(0, 3).map((product) => (
                              <Badge key={product} variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-2 py-1 rounded-full text-xs">
                                {product}
                              </Badge>
                            ))}
                            {category.products.length > 3 && (
                              <Badge variant="outline" className="border-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
                                +{category.products.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-green-600 font-semibold text-sm">
                            <span>İncele</span>
                            <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Package className="w-3 h-3" />
                              <span>{category.count}</span>
                            </div>
                                    <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>{category.rating}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCategories.map((category) => (
                  <Link key={category.slug} href={`/categories/${category.slug}`} className="group block">
                    <Card className="group hover:shadow-2xl transition-all duration-700 border-0 bg-white overflow-hidden rounded-2xl cursor-pointer transform hover:scale-[1.02]">
                      <CardContent className="p-8">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-4xl shadow-xl transform group-hover:scale-110 transition-transform duration-700`}>
                              {category.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-4 mb-3">
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                  {category.name}
                                </h3>
                                {category.featured && (
                                  <Badge className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                    <Star className="w-4 h-4 mr-1 fill-current" />
                                    Öne Çıkan
                                  </Badge>
                                )}
                                <div className="flex items-center space-x-1">
                                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                                  <span className="text-sm font-bold">{category.rating}</span>
                                </div>
                              </div>
                              <p className="text-gray-600 mb-4 text-lg leading-relaxed">{category.description}</p>
                              
                              <div className="flex items-center space-x-8">
                                <div className="flex items-center space-x-6">
                                  <div className="text-center">
                                    <div className="text-xl font-bold text-gray-900">{category.count}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Ürün</div>
                                  </div>
                                  <div className="w-px h-6 bg-gray-200"></div>
                                  <div className="text-center">
                                    <div className="text-xl font-bold text-green-600">%100</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wide">Organik</div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                  {category.products.slice(0, 6).map((product) => (
                                    <Badge key={product} variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1 rounded-full text-sm">
                                      {product}
                                    </Badge>
                                  ))}
                                  {category.products.length > 6 && (
                                    <Badge variant="outline" className="border-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm">
                                      +{category.products.length - 6} ürün
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-sm text-gray-500 mb-2">{category.count} ürün</div>
                              <div className="text-xl font-bold text-green-600 flex items-center">
                                İncele
                                <ChevronRight className="w-6 h-6 ml-2 transform group-hover:translate-x-2 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredCategories.length === 0 && (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Kategori Bulunamadı</h3>
                <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                  "{searchQuery}" için kategori bulunamadı. Başka bir kelime deneyin.
                </p>
                <Button
                  onClick={() => setSearchQuery('')}
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-3 rounded-xl font-semibold shadow-lg"
                >
                  Aramayı Temizle
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}