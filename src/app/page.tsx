'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Search, Menu, X, Star, Truck, Shield, Leaf, ChevronRight, ChevronLeft, Sparkles, Heart, Loader2, Check, Zap, Droplets, Sun, Wind, Globe, Users, Award, Clock, MapPin, CheckCircle, User, ShoppingBag, ChevronDown, Package, CircleX, Mail, ArrowRight, TrendingUp, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import { CategoryLink } from '@/components/category-link'
import { useCartStore } from '@/stores/cart-store'
import { useAuth } from '@/contexts/auth-context'
import { AuthSidebar } from '@/components/auth-sidebar'
import { PromotionModal } from '@/components/promotion-modal'
import NutritionalBadge from '@/components/ui/nutritional-badge'

// Senior Designer Custom Styles
const seniorDesignerStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes slideInFromTop {
    0% { transform: translateY(-100px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideInFromBottom {
    0% { transform: translateY(100px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes fadeInScale {
    0% { transform: scale(0.9); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  
  .animate-slide-in-top {
    animation: slideInFromTop 0.8s ease-out;
  }
  
  .animate-slide-in-bottom {
    animation: slideInFromBottom 0.8s ease-out;
  }
  
  .animate-fade-in-scale {
    animation: fadeInScale 0.6s ease-out;
  }
  
  .glass-morphism {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.18);
  }
  
  .shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
  
  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }
`

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeProductCard, setActiveProductCard] = useState<string | null>(null)
  const [isAuthSidebarOpen, setIsAuthSidebarOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [nutritionalEvaluations, setNutritionalEvaluations] = useState<{[key: string]: any}>({})
  const [searchOpen, setSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { addItem, isLoading, getTotalItems, loadCart } = useCartStore()
  const { user, logout, isAuthenticated } = useAuth()
  const cartItemCount = getTotalItems()

  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style')
    styleElement.textContent = seniorDesignerStyles
    document.head.appendChild(styleElement)
    return () => {
      document.head.removeChild(styleElement)
    }
  }, [])

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Kategori resimleri için fonksiyon
  const getCategoryImage = (slug: string) => {
    const categoryImages: { [key: string]: string } = {
      'meyveler': '1542838132-92c53300491e',
      'sebzeler': '1546754977-5cc9c2a9ea1e',
      'bakliyat': '1595544276291-9c2b9d1c8b4e',
      'sut-urunleri': '1580593448283-6b9d447cefb4',
      'et-tavuk': '1604500799114-b9935a31d4bf',
      'bal-recel': '1556769751895-d4612621463c'
    }
    return categoryImages[slug] || '1542838132-92c53300491e'
  }

  // Search autocomplete functionality
  const autocompleteProducts = searchQuery.length >= 2 
    ? allProducts.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : []

  const handleSelectProduct = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description
    })
    toast({
      title: "🛒 Ürün Sepete Eklendi!",
      description: `${product.name} başarılı bir şekilde sepetinize eklendi.`,
    })
    setSearchQuery(product.name)
    setSearchOpen(false)
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchOpen(false)
    setTimeout(() => {
      searchInputRef.current?.focus()
    }, 100)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.search-dropdown') && !target.closest('input')) {
        setSearchOpen(false)
      }
      if (!target.closest('.user-menu') && !target.closest('button')) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Load nutritional evaluations for products
  const loadNutritionalEvaluations = async (products: any[]) => {
    const evaluations: {[key: string]: any} = {};
    
    for (const product of products) {
      try {
        const response = await fetch(`/api/nutritional-evaluation/${product.id}`);
        if (response.ok) {
          const evaluation = await response.json();
          evaluations[product.id] = evaluation;
        }
      } catch (error) {
        console.error(`Failed to load evaluation for product ${product.id}:`, error);
      }
    }
    
    setNutritionalEvaluations(evaluations);
  };

  // Load products and categories from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const allProductsResponse = await fetch('/api/products?limit=100')
        if (allProductsResponse.ok) {
          const allProductsData = await allProductsResponse.json()
          setAllProducts(allProductsData.products || [])
        }

        const productsResponse = await fetch('/api/products?featured=true&limit=8')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          const mappedProducts = productsData.products.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.price * 1.2,
            image: product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop&crop=center',
            badge: product.isFeatured ? 'POPÜLER' : 'YENİ',
            rating: 4.5 + Math.random() * 0.5,
            reviews: Math.floor(Math.random() * 200) + 50,
            description: product.description || '',
            inStock: product.stock > 0,
            tagline: product.isOrganic ? '%100 Organik' : 'Doğal Ürün',
            color: 'from-green-400 to-emerald-500'
          }))
          setFeaturedProducts(mappedProducts)
          
          // Load nutritional evaluations for featured products
          await loadNutritionalEvaluations(mappedProducts)
        }

        const categoriesResponse = await fetch('/api/products')
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json()
          setCategories(categoriesData.categories.map((category: any) => ({
            name: category.name,
            icon: `https://images.unsplash.com/photo-${getCategoryImage(category.slug)}?w=64&h=64&fit=crop&crop=center`,
            slug: category.slug,
            count: category._count.products,
            gradient: 'from-green-400 to-emerald-500',
            description: category.description || 'Taze organik ürünler'
          })))
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setProductsLoading(false)
      }
    }

    loadData()
    loadCart()
  }, [loadCart])

  // Modern hero data
  const heroData = {
    title: "Organik Yaşam Tarzı",
    subtitle: "Doğadan sofranıza tazelik",
    description: "%100 organik ürünlerle sağlıklı bir yaşam için doğru yerdesiniz. En taze ürünleri kapınıza getiriyoruz.",
    stats: [
      { number: "15+", label: "Yıllık Deneyim", icon: Award },
      { number: "500+", label: "Organik Ürün", icon: Leaf },
      { number: "50K+", label: "Mutlu Müşteri", icon: Users }
    ]
  }

  // Slider data for hero images
  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&h=300&fit=crop&crop=center",
      title: "Taze Ürünler",
      badge: "%100 Organik"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&h=300&fit=crop&crop=center",
      title: "Meyveler",
      badge: "Doğal Ürün"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1590776933108-9cbe9e5a7a5b?w=500&h=300&fit=crop&crop=center",
      title: "Sebzeler",
      badge: "Taze Günlük"
    }
  ]

  const addToCart = async (product: any) => {
    try {
      await addItem({
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
    } catch (error) {
      console.error('Cart error:', error)
      toast({
        title: "Hata",
        description: "Sepete eklenirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  // Auto-play slider
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 4000) // Change slide every 4 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
      {/* Sophisticated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-100/30 to-emerald-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-100/30 to-teal-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-lime-100/20 to-green-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Modern Navigation Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-morphism shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BGoody</span>
            </Link>

            {/* Center Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {['Ana Sayfa', 'Ürünler', 'Kategoriler', 'Hakkımızda'].map((item) => (
                <Link 
                  key={item}
                  href="#" 
                  className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchOpen(true)}
                    className="pl-10 pr-4 w-64 h-10 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-full"
                  />
                </div>
                
                {/* Search Dropdown */}
                {searchOpen && autocompleteProducts.length > 0 && (
                  <div className="absolute top-12 left-0 right-0 bg-white rounded-xl shadow-xl border border-gray-100 max-h-80 overflow-y-auto search-dropdown">
                    {autocompleteProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleSelectProduct(product)}
                      >
                        <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500">₺{product.price}</p>
                        </div>
                        <ShoppingCart className="w-4 h-4 text-green-600" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link href="/cart" className="relative group">
                <Button variant="ghost" size="sm" className="hover:bg-green-50 transition-colors duration-200 rounded-full">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>

                {/* User Account */}
              {isAuthenticated ? (
                <div className="relative user-menu">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-green-50 transition-colors duration-200 rounded-full"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <User className="w-5 h-5" />
                  </Button>
                  
                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name || 'Kullanıcı'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user?.email}
                        </p>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profilim
                      </Link>
                      
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Siparişlerim
                      </Link>
                      
                      {user?.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-200 rounded-full"
                  onClick={() => setIsAuthSidebarOpen(true)}
                >
                  Giriş Yap
                </Button>
              )}

              {/* Mobile Menu */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-green-50 transition-colors duration-200 rounded-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Compact & Modern */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-5 w-16 h-16 bg-green-200/20 rounded-full animate-float"></div>
        <div className="absolute top-20 right-10 w-12 h-12 bg-emerald-200/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-10 left-1/4 w-14 h-14 bg-lime-200/20 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-in-top">
              <Badge className="bg-green-100 text-green-800 border-green-200 mb-4 px-3 py-1 rounded-full text-sm">
                🌿 Yeni Sezon Ürünleri
              </Badge>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                {heroData.title}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  {heroData.subtitle}
                </span>
              </h1>
              
              <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-lg">
                {heroData.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 px-6 py-3 text-base font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                  Alışverişe Başla
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-6 py-3 text-base font-semibold rounded-full transition-all duration-300">
                  Katalog İndir
                </Button>
              </div>

              {/* Compact Stats */}
              <div className="grid grid-cols-3 gap-4">
                {heroData.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <stat.icon className="w-5 h-5 text-green-700" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{stat.number}</h3>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Compact Hero Slider */}
            <div className="relative animate-slide-in-bottom">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-2xl blur-2xl"></div>
                
                {/* Slider Container */}
                <div className="relative w-full h-[300px] lg:h-[350px] rounded-2xl overflow-hidden shadow-xl">
                  {heroSlides.map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  
                  {/* Slider Navigation */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Slide Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? 'bg-white w-8'
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Compact Floating Badge */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {heroSlides[currentSlide].badge}
                      </p>
                      <p className="text-xs text-gray-600">
                        {heroSlides[currentSlide].title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compact Price Card */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Başlangıç Fiyatı</p>
                    <p className="text-lg font-bold text-green-600">₺19.90</p>
                    <p className="text-xs text-gray-500 line-through">₺25.90</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Modern Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-scale">
            <Badge className="bg-green-100 text-green-800 border-green-200 mb-4 px-4 py-2 rounded-full">
              Kategoriler
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Geniş Ürün Yelpazesi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sağlıklı yaşamınız için her şey burada
            </p>
          </div>

          {productsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category, index) => (
                <div
                  key={category.slug}
                  className="group cursor-pointer hover-lift animate-fade-in-scale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 border border-green-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <img src={category.icon} alt={category.name} className="w-8 h-8 rounded-lg" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} ürün</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products - Modern Cards */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 border-green-200 mb-4 px-4 py-2 rounded-full">
              Öne Çıkanlar
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              En Popüler Ürünler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En taze ve kaliteli organik ürünlerimiz
            </p>
          </div>

          {productsLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card
                    className="group cursor-pointer hover-lift overflow-hidden border-0 shadow-lg animate-fade-in-scale h-full"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onMouseEnter={() => setActiveProductCard(product.id)}
                    onMouseLeave={() => setActiveProductCard(null)}
                  >
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-600 text-white border-none">
                        {product.badge}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-red-500 p-2 rounded-full"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-green-600 text-xs">
                          {product.tagline}
                        </Badge>
                        <NutritionalBadge 
                          evaluation={nutritionalEvaluations[product.id]} 
                          size="sm"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>
                    
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
                        ({product.reviews})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">₺{product.price}</span>
                        <span className="text-sm text-gray-500 line-through ml-2">
                          ₺{product.originalPrice.toFixed(2)}
                        </span>
                      </div>
                      <Badge
                        variant={product.inStock ? "default" : "secondary"}
                        className={product.inStock ? "bg-green-100 text-green-800" : ""}
                      >
                        {product.inStock ? "Stokta" : "Tükendi"}
                      </Badge>
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full transition-all duration-300"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        addToCart(product)
                      }}
                      disabled={isLoading(product.id) || !product.inStock}
                    >
                      {isLoading(product.id) ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 mr-2" />
                      )}
                      Sepete Ekle
                    </Button>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-full px-8">
                Tüm Ürünleri Gör
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Icons */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 border-green-200 mb-4 px-4 py-2 rounded-full">
              Neden BGoody?
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Avantajlar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Size en iyi hizmeti sunmak için buradayız
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: "Aynı Gün Teslimat",
                description: "15:00'e kadar verilen siparişler aynı gün kargoya verilir",
                color: "from-blue-500 to-indigo-600"
              },
              {
                icon: Shield,
                title: "%100 Organik Garantisi",
                description: "Tüm ürünlerimiz sertifikalı organik çiftliklerden",
                color: "from-green-500 to-emerald-600"
              },
              {
                icon: Heart,
                title: "Müşteri Memnuniyeti",
                description: "15 gün iade garantisi ve 7/24 müşteri desteği",
                color: "from-red-500 to-pink-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center group hover-lift animate-fade-in-scale"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Modern */}
      <section className="py-20 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-4">
              Organik Kampanyalardan Haberdar Olun
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Yeni ürünler, indirimler ve sağlıklı yaşam ipuçları için bültenimize abone olun
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="E-posta adresiniz"
                className="bg-white/90 backdrop-blur-sm border-white/20 placeholder-gray-500 h-12 rounded-full shadow-lg"
              />
              <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full">
                Abone Ol
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Modern */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">BGoody</span>
              </div>
              <p className="text-gray-400 mb-4">
                Doğal ve sağlıklı yaşam için organik ürünler
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Hızlı Linkler</h4>
              <ul className="space-y-3">
                <li><Link href="/products" className="text-gray-400 hover:text-white transition">Ürünler</Link></li>
                <li><Link href="/categories" className="text-gray-400 hover:text-white transition">Kategoriler</Link></li>
                <li><Link href="/hakkimizda" className="text-gray-400 hover:text-white transition">Hakkımızda</Link></li>
                <li><Link href="/iletisim" className="text-gray-400 hover:text-white transition">İletişim</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Müşteri Hizmetleri</h4>
              <ul className="space-y-3">
                <li><Link href="/siparisler" className="text-gray-400 hover:text-white transition">Sipariş Takibi</Link></li>
                <li><Link href="/profile" className="text-gray-400 hover:text-white transition">Hesabım</Link></li>
                <li><Link href="/iletisim" className="text-gray-400 hover:text-white transition">Yardım</Link></li>
                <li><Link href="/iletisim" className="text-gray-400 hover:text-white transition">İade Politikası</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">İletişim</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5" />
                  <span>İstanbul, Türkiye</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5" />
                  <span>info@bgoody.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="w-5 h-5 flex items-center justify-center">📞</span>
                  <span>0850 123 45 67</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 mb-4 md:mb-0">
                © 2024 BGoody. Tüm hakları saklıdır.
              </p>
              <div className="flex space-x-6">
                <Link href="/privacy" className="text-gray-400 hover:text-white transition">Gizlilik Politikası</Link>
                <Link href="/terms" className="text-gray-400 hover:text-white transition">Kullanım Koşulları</Link>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition">Çerez Politikası</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Sidebar */}
      <AuthSidebar
        isOpen={isAuthSidebarOpen}
        onClose={() => setIsAuthSidebarOpen(false)}
      />

      {/* Promotion Modal */}
      <PromotionModal />
    </div>
  )
}