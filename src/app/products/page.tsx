'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { useToast } from '@/hooks/use-toast'
import { ShoppingCart, Search, Filter, Star, Grid, List, X, Heart, SlidersHorizontal, Package } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/stores/cart-store'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  stock: number
  sku: string
  categoryId: string
  isOrganic: boolean
  isFeatured: boolean
  isActive: boolean
  category?: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  _count: {
    products: number
  }
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem, getTotalItems } = useCartStore()
  const { toast } = useToast()
  const cartItemCount = getTotalItems()

  // Load products and categories from API
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load products
        const productsResponse = await fetch('/api/products?limit=100')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setProducts(productsData.products || [])
        }

        // Load categories
        const categoriesResponse = await fetch('/api/products')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories || [])
        }
      } catch (error) {
        console.error('Failed to load data:', error)
        toast({
          title: "Hata",
          description: "Veriler yüklenirken bir hata oluştu",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category?.name === selectedCategory
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
    const matchesActive = product.isActive
    return matchesSearch && matchesCategory && matchesPrice && matchesActive
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'featured':
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const addToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || '/images/placeholder.jpg',
        description: product.description
      })
      toast({
        title: "🎉 Ürün Sepete Eklendi!",
        description: `${product.name} başarılı bir şekilde sepetinize eklendi.`,
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Sepete eklenirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ürünler yükleniyor...</p>
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
                <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-light text-gray-900">BGoody</span>
                <span className="text-xl font-semibold text-green-600">Food</span>
              </div>
            </Link>

            <div className="hidden lg:flex flex-1 max-w-2xl mx-12">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Organik ürünleri ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 w-full h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 h-10 px-6">
                  Ara
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <Link href="/cart" className="relative group z-50">
                <div className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                  <ShoppingCart className="w-6 h-6 text-gray-800 hover:text-green-600 transition-colors" />
                </div>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse border-2 border-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-green-600 transition">Ana Sayfa</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Ürünler</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`${isFilterOpen ? 'block' : 'hidden'} lg:block lg:w-80`}>
            <div className="bg-white rounded-2xl p-6 sticky top-24 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Kategoriler</h4>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategory === category.name}
                          onCheckedChange={(checked) => 
                            setSelectedCategory(checked ? category.name : '')
                          }
                          className="border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <label 
                          htmlFor={category.id} 
                          className="text-sm text-gray-700 cursor-pointer flex-1 font-medium"
                        >
                          {category.name}
                        </label>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {category._count?.products || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Fiyat Aralığı</h4>
                  <div className="space-y-4">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={500}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span className="font-medium">₺{priceRange[0]}</span>
                      <span className="font-medium">₺{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedCategory('')
                    setPriceRange([0, 500])
                  }}
                >
                  Filtreleri Temizle
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="lg:hidden"
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filtreler
                  </Button>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{sortedProducts.length}</span> ürün bulundu
                  </div>
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
                      <SelectItem value="name">İsim (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white cursor-pointer">
                    <CardContent className="p-0">
                      <div>
                        <div className="relative">
                          <div className="aspect-square overflow-hidden">
                            <img 
                              src={product.image || '/images/placeholder.jpg'} 
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          {product.isFeatured && (
                            <Badge className="absolute top-4 left-4 bg-green-600 hover:bg-green-700">
                              Öne Çıkan
                            </Badge>
                          )}
                          {product.isOrganic && (
                            <Badge className="absolute top-4 right-4 bg-green-100 text-green-800 hover:bg-green-200">
                              Organik
                            </Badge>
                          )}
                          {!product.stock || product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge className="bg-red-600 hover:bg-red-700 text-white">
                                Stokta Yok
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {product.description || 'Stok kodu: ' + product.sku}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-gray-900">₺{product.price}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : ''}`} />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">(4.5)</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                            onClick={(e) => addToCart(product, e)}
                            disabled={!product.stock || product.stock === 0}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {(!product.stock || product.stock === 0) ? 'Stokta Yok' : 'Sepete Ekle'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ürün bulunamadı</h3>
                <p className="text-gray-500">Filtrelerinizi değiştirerek tekrar deneyin.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}