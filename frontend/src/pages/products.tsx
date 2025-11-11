import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShoppingCart, Search, Star, Grid, List, Heart, Filter } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'
import { useToast } from '@/hooks/use-toast'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loadingProducts, setLoadingProducts] = useState<Set<string>>(new Set())
  const { addItem } = useCartStore()
  const { toast } = useToast()

  // Mock products data
  const products = [
    {
      id: '1',
      name: 'Organik Elma',
      price: 32.50,
      originalPrice: 45.00,
      image: '/products/apple.jpg',
      badge: 'YENİ',
      rating: 4.8,
      reviews: 124,
      inStock: true,
      description: '1kg',
      discount: 28,
      tagline: 'Crunchy & Sweet',
      color: 'from-red-400 to-pink-500',
      category: 'Meyveler'
    },
    {
      id: '2',
      name: 'Organik Portakal',
      price: 28.90,
      originalPrice: null,
      image: '/products/apple.jpg',
      badge: 'YENİ',
      rating: 4.5,
      reviews: 45,
      inStock: true,
      description: '1kg',
      discount: 0,
      tagline: 'Vitamin C Bombası',
      color: 'from-orange-400 to-yellow-500',
      category: 'Meyveler'
    },
    {
      id: '3',
      name: 'Organik Muz',
      price: 42.90,
      originalPrice: null,
      image: '/products/apple.jpg',
      badge: 'POPÜLER',
      rating: 4.7,
      reviews: 89,
      inStock: true,
      description: '1kg',
      discount: 0,
      tagline: 'Enerji Kaynağı',
      color: 'from-yellow-400 to-orange-500',
      category: 'Meyveler'
    },
    {
      id: '4',
      name: 'Organik Çilek',
      price: 65.00,
      originalPrice: 85.00,
      image: '/products/apple.jpg',
      badge: 'ÖZEL',
      rating: 4.9,
      reviews: 156,
      inStock: true,
      description: '500gr',
      discount: 24,
      tagline: 'Lezzet Şöleni',
      color: 'from-red-500 to-pink-500',
      category: 'Meyveler'
    },
    {
      id: '5',
      name: 'Organik Domates',
      price: 22.50,
      originalPrice: null,
      image: '/products/apple.jpg',
      badge: 'TAZE',
      rating: 4.6,
      reviews: 78,
      inStock: true,
      description: '1kg',
      discount: 0,
      tagline: 'Baharatlı Lezzet',
      color: 'from-red-600 to-orange-600',
      category: 'Sebzeler'
    },
    {
      id: '6',
      name: 'Organik Salatalık',
      price: 18.90,
      originalPrice: null,
      image: '/products/apple.jpg',
      badge: 'YENİ',
      rating: 4.4,
      reviews: 56,
      inStock: true,
      description: '1kg',
      discount: 0,
      tagline: 'Serinletici Tazelik',
      color: 'from-green-500 to-emerald-600',
      category: 'Sebzeler'
    }
  ]

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
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

  const addToCart = async (product: any) => {
    setLoadingProducts(prev => new Set(prev).add(product.id))
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoadingProducts(prev => {
      const newSet = new Set(prev)
      newSet.delete(product.id)
      return newSet
    })
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    })
    
    toast({
      title: "🎉 Ürün Sepete Eklendi!",
      description: `${product.name} başarılı bir şekilde sepetinize eklendi.`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tüm
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Ürünler</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            %100 organik sertifikalı ürünlerle sağlıklı bir yaşam
          </p>
        </div>

        {/* Filters */}
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

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="🌿 Ürünlerde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 w-full h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
            />
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Ürün bulunamadı</h3>
            <p className="text-gray-600">Arama kriterlerinize uygun ürün bulunamadı.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sortedProducts.map((product) => (
              <Card key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 transform hover:-translate-y-2">
                <div className="relative">
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {product.badge}
                      </Badge>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4">
                      <Button size="icon" className="w-10 h-10 bg-white rounded-full shadow-lg hover:bg-gray-50">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>
                    
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <div className="absolute bottom-4 left-4">
                        <div className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                          %{product.discount} İNDİRİM
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Product Info */}
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.tagline}</p>
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {product.category}
                      </Badge>
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
                      onClick={() => addToCart(product)}
                      disabled={loadingProducts.has(product.id)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {loadingProducts.has(product.id) ? 'Ekleniyor...' : 'Sepete Ekle'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}