'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Menu,
  X,
  Search,
  Leaf
} from 'lucide-react'

interface Product {
  id: string
  name: string
  nameTR: string
  description: string
  descriptionTR: string
  price: number
  originalPrice: number
  category: string
  categoryTR: string
  badge: string
  badgeTR: string
  rating: number
  reviews: number
  inStock: boolean
  stock: number
  unit: string
  unitTR: string
  origin: string
  originTR: string
  certification: string[]
  images: string[]
  nutritionInfo?: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  storageInfo?: string
  storageInfoTR?: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem, isLoading, getTotalItems } = useCartStore()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlist, setIsWishlist] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const cartItemCount = getTotalItems()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          toast({
            title: "Hata",
            description: "Ürün bulunamadı",
            variant: "destructive",
          })
          router.push('/products')
        }
      } catch (error) {
        toast({
          title: "Hata",
          description: "Bir hata oluştu",
          variant: "destructive",
        })
        router.push('/products')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id, router])

  const handleAddToCart = async () => {
    if (product) {
      try {
        for (let i = 0; i < quantity; i++) {
          await addItem({
            id: product.id,
            name: product.nameTR,
            price: product.price,
            image: product.image || '/placeholder-image.jpg',
            description: product.descriptionTR
          })
        }
          toast({
          title: "🎉 Ürün Sepete Eklendi!",
          description: `${quantity} ${product.nameTR} başarılı bir şekilde sepetinize eklendi.`,
          variant: "success",
        })
      } catch (error) {
        toast({
          title: "Hata",
          description: "Sepete eklenirken bir hata oluştu",
          variant: "destructive",
        })
      }
    }
  }

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1)
    } else {
      setQuantity(prev => Math.max(1, prev - 1))
    }
  }

  const handleImageChange = (direction: 'prev' | 'next') => {
    if (!product?.images) return
    
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      )
    } else {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  const toggleWishlist = () => {
    setIsWishlist(!isWishlist)
    toast({
      title: "Başarılı!",
      description: isWishlist ? 'İstek listesinden çıkarıldı' : 'İstek listesine eklendi',
      variant: "success",
    })
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.nameTR,
        text: product?.descriptionTR,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Başarılı!",
        description: 'Ürün linki kopyalandı',
        variant: "success",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-8 rounded"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              <div className="bg-gray-200 h-20 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ürün bulunamadı</h1>
          <Link href="/products">
            <Button>Ürünlere Geri Dön</Button>
          </Link>
        </div>
      </div>
    )
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
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
                <div className="relative">
                  <div className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                    <ShoppingCart className="w-6 h-6 text-gray-800 hover:text-green-600 transition-colors" />
                  </div>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse border-2 border-white">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl font-light text-gray-900">BGoody</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Food</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <Link 
                  href="/"
                  className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
                <Link 
                  href="/products"
                  className="block w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ürünler
                </Link>
                <Link 
                  href="/cart"
                  className="block w-full text-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Sepetim</span>
                    {cartItemCount > 0 && (
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-green-600">Ana Sayfa</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-green-600">Ürünler</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category}`} className="hover:text-green-600">
            {product.categoryTR}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.nameTR}</span>
        </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
            <Image
              src={product.images[currentImageIndex]}
              alt={product.nameTR}
              fill
              className="object-cover"
            />
            
            {/* Image Navigation */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => handleImageChange('prev')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleImageChange('next')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-500 text-white">
                  {product.badgeTR}
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    currentImageIndex === index 
                      ? 'border-green-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.nameTR} - ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nameTR}</h1>
            <p className="text-lg text-gray-600">{product.name}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-500">({product.reviews} değerlendirme)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-3">
            <span className="text-3xl font-bold text-green-600">
              ₺{product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-gray-500 line-through">
                  ₺{product.originalPrice.toFixed(2)}
                </span>
                <Badge variant="destructive" className="text-sm">
                  %{discount} İndirim
                </Badge>
              </>
            )}
            <span className="text-sm text-gray-500">/ {product.unitTR}</span>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            {product.inStock ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">
                  Stokta ({product.stock} {product.unitTR})
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-red-600">Stokta yok</span>
              </>
            )}
          </div>

          {/* Short Description */}
          <p className="text-gray-700 leading-relaxed">
            {product.descriptionTR}
          </p>

          {/* Origin & Certification */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Menşei:</span>
              <span className="text-sm">{product.originTR}</span>
            </div>
            {product.certification.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.certification.map((cert, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Miktar:</span>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange('decrease')}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange('increase')}
                  className="p-2 hover:bg-gray-100 transition-colors"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock || isLoading(product.id)}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isLoading(product.id) ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Ekleniyor...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Sepete Ekle
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={toggleWishlist}
              >
                <Heart className={`h-5 w-5 ${isWishlist ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={shareProduct}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
            <div className="text-center">
              <Truck className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <span className="text-xs text-gray-600">Kargo Bedava</span>
            </div>
            <div className="text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <span className="text-xs text-gray-600">%100 Organik</span>
            </div>
            <div className="text-center">
              <RefreshCw className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <span className="text-xs text-gray-600">İade Garantisi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Ürün Açıklaması</TabsTrigger>
            <TabsTrigger value="nutrition">Besin Değerleri</TabsTrigger>
            <TabsTrigger value="storage">Saklama Koşulları</TabsTrigger>
            <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Ürün Hakkında</h3>
                <div className="prose max-w-none text-gray-700">
                  <p>{product.descriptionTR}</p>
                  <p className="mt-4">{product.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Besin Değerleri</h3>
                {product.nutritionInfo ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {product.nutritionInfo.calories}
                      </div>
                      <div className="text-sm text-gray-600">Kalori</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {product.nutritionInfo.protein}g
                      </div>
                      <div className="text-sm text-gray-600">Protein</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {product.nutritionInfo.carbs}g
                      </div>
                      <div className="text-sm text-gray-600">Karbonhidrat</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {product.nutritionInfo.fat}g
                      </div>
                      <div className="text-sm text-gray-600">Yağ</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {product.nutritionInfo.fiber}g
                      </div>
                      <div className="text-sm text-gray-600">Lif</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Bu ürün için besin değeri bilgisi mevcut değil.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="storage" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Saklama Koşulları</h3>
                <p className="text-gray-700">
                  {product.storageInfoTR || 'Bu ürün için saklama koşulu bilgisi mevcut değil.'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Müşteri Değerlendirmeleri</h3>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Henüz değerlendirme yapılmamış.</p>
                  <Button variant="outline">İlk Değerlendirmeyi Yap</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      </div>
    </div>
  )
}