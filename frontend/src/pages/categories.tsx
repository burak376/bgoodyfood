import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Leaf, Grid3X3 } from 'lucide-react'
import { CategoryLink } from '@/components/category-link'

export default function CategoriesPage() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full px-6 py-3 text-sm font-semibold mb-6 shadow-lg">
            <Leaf className="w-5 h-5" />
            <span>Doğal Lezzetler Dünyası</span>
            <ChevronRight className="w-4 h-4" />
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Tüm
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"> Kategoriler</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Her bir kategori, doğanın en saf haliyle size özel olarak seçilmiştir. 
            <span className="font-semibold text-green-600"> %100 organik sertifikalı</span> ürünlerle sağlıklı bir yaşam başlangıcı.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
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

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Grid3X3 className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">6</div>
              <div className="text-gray-600">Kategori</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">218+</div>
              <div className="text-gray-600">Organik Ürün</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ChevronRight className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Mutlu Müşteri</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}