import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ShoppingCart, Search, Menu, X, Leaf, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/stores/cart-store'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { items } = useCartStore()
  const location = useLocation()

  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  const navigation = [
    { name: 'Ana Sayfa', href: '/' },
    { name: 'Ürünler', href: '/products' },
    { name: 'Kategoriler', href: '/categories' },
    { name: 'Hakkımızda', href: '/about' },
    { name: 'İletişim', href: '/contact' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-light text-gray-900">BGoody</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Food</span>
              </div>
            </Link>

            {/* Desktop Search */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-12">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-green-500 transition-colors" />
                <Input
                  type="text"
                  placeholder="🌿 Organik ürünleri keşfet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 w-full h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl transition-all"
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-10 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-gray-700 hover:text-green-600 transition font-medium relative group ${
                    location.pathname === item.href ? 'text-green-600' : ''
                  }`}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-6">
              <Link to="/login" className="hidden lg:block text-gray-700 hover:text-green-600 transition font-medium">
                Giriş Yap
              </Link>
              <Link to="/cart" className="relative group">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-green-600 transition" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden"
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
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              {/* Menu Header */}
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
              
              {/* Mobile Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="🌿 Organik ürünleri keşfet..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full h-12 bg-gray-50 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
                  />
                </div>
              </div>
              
              {/* Navigation Links */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center justify-between p-4 rounded-xl hover:bg-green-50 transition-colors group ${
                      location.pathname === item.href ? 'bg-green-50 text-green-600' : 'text-gray-700'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="font-medium">{item.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                  </Link>
                ))}
              </nav>
              
              {/* Account Actions */}
              <div className="mt-8 space-y-3">
                <Link 
                  to="/login"
                  className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link 
                  to="/cart"
                  className="block w-full text-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Sepetim</span>
                    {cartCount > 0 && (
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
              
              {/* Contact Info */}
              <div className="mt-8 p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-green-800">Bize Ulaşın</span>
                </div>
                <p className="text-sm text-green-700">0850 123 45 67</p>
                <p className="text-sm text-green-700">info@bgoody.com</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-light">BGoody</span>
                  <span className="text-xl font-bold">Food</span>
                </div>
              </div>
              <p className="text-gray-400">
                Doğadan gelen taze ve organik ürünlerle sağlıklı bir yaşam başlangıcı.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/products" className="hover:text-green-400 transition">Ürünler</Link></li>
                <li><Link to="/categories" className="hover:text-green-400 transition">Kategoriler</Link></li>
                <li><Link to="/about" className="hover:text-green-400 transition">Hakkımızda</Link></li>
                <li><Link to="/contact" className="hover:text-green-400 transition">İletişim</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4">Kategoriler</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/categories/meyveler" className="hover:text-green-400 transition">Meyveler</Link></li>
                <li><Link to="/categories/sebzeler" className="hover:text-green-400 transition">Sebzeler</Link></li>
                <li><Link to="/categories/bakliyat" className="hover:text-green-400 transition">Bakliyat</Link></li>
                <li><Link to="/categories/sut-urunleri" className="hover:text-green-400 transition">Süt Ürünleri</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">İletişim</h3>
              <ul className="space-y-2 text-gray-400">
                <li>0850 123 45 67</li>
                <li>info@bgoody.com</li>
                <li>İstanbul, Türkiye</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 BGoody Food. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}