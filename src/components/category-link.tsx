'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Star, ShoppingBag, Leaf } from 'lucide-react'
import { useState } from 'react'

interface CategoryLinkProps {
  name: string
  icon: string
  slug: string
  count: number
  gradient: string
  description: string
}

export function CategoryLink({ name, icon, slug, count, gradient, description }: CategoryLinkProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    // 阻止任何默认的剪贴板行为
    e.preventDefault()
    // 手动导航
    window.location.href = `/categories/${slug}`
  }

  return (
    <Link 
      href={`/categories/${slug}`}
      onClick={handleClick}
      className="block group"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 bg-white rounded-2xl">
        <CardContent className="p-0">
          {/* Enhanced Image Container */}
          <div className="relative h-64 overflow-hidden">
            {/* Main image */}
            <img 
              src={icon} 
              alt={name}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
            
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
            
            {/* Top badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                <Leaf className="w-3 h-3 mr-1 text-green-600" />
                %100 Organik
              </Badge>
            </div>
            
            {/* Product count badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                <span className="text-sm font-bold text-gray-800">{count}+</span>
              </div>
            </div>
            
            {/* Bottom gradient for text readability */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent h-24"></div>
            
            {/* Category name overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-xl font-bold text-white mb-1 drop-shadow-lg">{name}</h3>
              <p className="text-sm text-white/90 drop-shadow">{description}</p>
            </div>
            
            {/* Hover effect button */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <div className={`bg-gradient-to-r ${gradient} text-white rounded-full p-3 shadow-lg`}>
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
          </div>
          
          {/* Enhanced Content Section */}
          <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`}></div>
                <span className="text-sm font-medium text-gray-600">Özel Koleksiyon</span>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300`} />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-2">(4.9)</span>
              </div>
              <span className="text-sm font-semibold text-green-600">Keşfet →</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}