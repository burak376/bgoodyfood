'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Leaf, ArrowLeft, Grid, List } from 'lucide-react'
import Link from 'next/link'
import { CategoryLink } from '@/components/category-link'
import { useToast } from '@/hooks/use-toast'

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { toast } = useToast()

  const categories = [
    { 
      name: 'Meyveler', 
      icon: '/icons/fruits-icon.png',
      slug: 'meyveler',
      count: 45,
      gradient: 'from-orange-400 to-red-500',
      description: 'Güneşin tadı',
      products: ['Elma', 'Armut', 'Portakal', 'Muz', 'Çilek', 'Üzüm']
    },
    { 
      name: 'Sebzeler', 
      icon: '/icons/vegetables-icon.png',
      slug: 'sebzeler',
      count: 38,
      gradient: 'from-green-400 to-emerald-500',
      description: 'Toprağın gücü',
      products: ['Domates', 'Salatalık', 'Biber', 'Patlıcan', 'Ispanak', 'Marul']
    },
    { 
      name: 'Bakliyat', 
      icon: '/icons/legumes-icon.png',
      slug: 'bakliyat',
      count: 52,
      gradient: 'from-amber-400 to-yellow-500',
      description: 'Enerji deposu',
      products: ['Nohut', 'Mercimek', 'Kuru Fasulye', 'Bulgur', 'Pirinç']
    },
    { 
      name: 'Süt Ürünleri', 
      icon: '/icons/dairy-icon.png',
      slug: 'sut-urunleri',
      count: 28,
      gradient: 'from-blue-400 to-indigo-500',
      description: 'Sağlık kaynağı',
      products: ['Süt', 'Yoğurt', 'Peynir', 'Tereyağı', 'Kaymak']
    },
    { 
      name: 'Et & Tavuk', 
      icon: '/icons/meat-icon.png',
      slug: 'et-tavuk',
      count: 31,
      gradient: 'from-red-500 to-pink-500',
      description: 'Protein zengini',
      products: ['Tavuk', 'Dana Et', 'Kuzu Et', 'Balık', 'Yumurta']
    },
    { 
      name: 'Bal & Reçel', 
      icon: '/icons/honey-icon.png',
      slug: 'bal-recel',
      count: 24,
      gradient: 'from-purple-400 to-pink-500',
      description: 'Tatlı anlar',
      products: ['Bal', 'Pekmez', 'Reçel', 'Marmelat', 'Helva']
    }
  ]

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()))
  )

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
                <Leaf className="w-5 h-5 text-green-600" />
                <h1 className="text-xl font-bold text-gray-900">Kategoriler</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Kategori ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 h-10 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 w-8 p-0"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredCategories.length} kategori bulundu
            </p>
          </div>

          {/* Categories Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
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
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <Card key={category.slug} className="group hover:shadow-lg transition-all duration-300 border-green-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <img 
                            src={category.icon} 
                            alt={category.name}
                            className="w-8 h-8 object-contain filter brightness-0 invert"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-600">{category.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{category.count} ürün</p>
                        </div>
                      </div>
                      <Link href={`/categories/${category.slug}`}>
                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                          İncele
                        </Button>
                      </Link>
                    </div>
                    
                    {/* Popular Products */}
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Popüler ürünler:</p>
                      <div className="flex flex-wrap gap-2">
                        {category.products.slice(0, 3).map((product) => (
                          <Badge key={product} variant="secondary" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                        {category.products.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.products.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Kategori Bulunamadı</h3>
              <p className="text-gray-600 mb-4">
                "{searchQuery}" için kategori bulunamadı.
              </p>
              <Button
                onClick={() => setSearchQuery('')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Aramayı Temizle
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}