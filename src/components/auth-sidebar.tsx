'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { X, Eye, EyeOff, Mail, Lock, Leaf, User, ArrowRight } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'

interface AuthSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthSidebar({ isOpen, onClose }: AuthSidebarProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  
  const { toast } = useToast()
  const { login, loginWithSocial, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      
      if (success) {
        toast({
          title: "🎉 Giriş Başarılı!",
          description: "Hoş geldiniz!",
        })
        onClose()
        // Reset form
        setEmail('')
        setPassword('')
      } else {
        setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.')
        toast({
          title: "Giriş Hatası",
          description: "E-posta veya şifre hatalı.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
      toast({
        title: "Hata",
        description: "Giriş yapılırken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validation
      if (password !== confirmPassword) {
        setError('Şifreler eşleşmiyor.')
        return
      }

      if (password.length < 6) {
        setError('Şifre en az 6 karakter olmalıdır.')
        return
      }

      const success = await register({
        name,
        email,
        password,
        phone,
        address
      })
      
      if (success) {
        toast({
          title: "🎉 Kayıt Başarılı!",
          description: "Hoş geldiniz! Hesabınız oluşturuldu.",
        })
        onClose()
        // Reset form
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setPhone('')
        setAddress('')
      } else {
        setError('Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.')
        toast({
          title: "Kayıt Hatası",
          description: "Kayıt olurken bir hata oluştu.",
          variant: "destructive",
        })
      }
    } catch (error) {
      setError('Kayıt olurken bir hata oluştu. Lütfen daha sonra tekrar deneyin.')
      toast({
        title: "Hata",
        description: "Kayıt olurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsSocialLoading(provider)
    setError('')

    try {
      const success = await loginWithSocial(provider)
      
      if (success) {
        toast({
          title: "🎉 Giriş Başarılı!",
          description: `${provider === 'google' ? 'Google' : 'Facebook'} ile giriş yapıldı!`,
        })
        onClose()
      } else {
        setError(`${provider === 'google' ? 'Google' : 'Facebook'} ile giriş yapılamadı.`)
        toast({
          title: "Giriş Hatası",
          description: `${provider === 'google' ? 'Google' : 'Facebook'} ile giriş yapılamadı.`,
          variant: "destructive",
        })
      }
    } catch (error) {
      setError('Sosyal medya girişi sırasında bir hata oluştu.')
      toast({
        title: "Hata",
        description: "Sosyal medya girişi sırasında bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSocialLoading(null)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90] lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[100] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">BGoody</span>
                <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Food</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
              <Button
                variant={activeTab === 'login' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('login')}
                className={`flex-1 ${activeTab === 'login' ? 'bg-white shadow-sm' : ''}`}
              >
                Giriş Yap
              </Button>
              <Button
                variant={activeTab === 'register' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('register')}
                className={`flex-1 ${activeTab === 'register' ? 'bg-white shadow-sm' : ''}`}
              >
                Üye Ol
              </Button>
            </div>

            {activeTab === 'login' ? (
              <>
                {/* Social Login */}
                <div className="space-y-3 mb-6">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isSocialLoading !== null}
                    className="w-full h-12 border-gray-200 hover:bg-gray-50"
                  >
                    {isSocialLoading === 'google' ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-3" />
                    ) : (
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    Google ile Giriş Yap
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={isSocialLoading !== null}
                    className="w-full h-12 border-gray-200 hover:bg-gray-50"
                  >
                    {isSocialLoading === 'facebook' ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-3" />
                    ) : (
                      <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                    Facebook ile Giriş Yap
                  </Button>
                </div>

                <div className="relative mb-6">
                  <Separator />
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                    <span className="text-xs text-gray-500">VEYA</span>
                  </div>
                </div>

                {/* Email Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      E-posta Adresi
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@bgoody.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Şifre
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 p-0 hover:bg-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700 text-sm">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Giriş Yapılıyor...
                      </div>
                    ) : (
                      'Giriş Yap'
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm font-medium text-green-800 mb-2">🔑 Demo Hesabı:</p>
                  <div className="space-y-1 text-sm text-green-700">
                    <p><strong>E-posta:</strong> admin@bgoody.com</p>
                    <p><strong>Şifre:</strong> admin123</p>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      // Navigate to forgot password page
                    }}
                    className="text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    Şifrenizi mi unuttunuz?
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Social Login for Register */}
                <div className="space-y-3 mb-6">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isSocialLoading !== null}
                    className="w-full h-12 border-gray-200 hover:bg-gray-50"
                  >
                    {isSocialLoading === 'google' ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-3" />
                    ) : (
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    Google ile Üye Ol
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('facebook')}
                    disabled={isSocialLoading !== null}
                    className="w-full h-12 border-gray-200 hover:bg-gray-50"
                  >
                    {isSocialLoading === 'facebook' ? (
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-3" />
                    ) : (
                      <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    )}
                    Facebook ile Üye Ol
                  </Button>
                </div>

                <div className="relative mb-6">
                  <Separator />
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                    <span className="text-xs text-gray-500">VEYA</span>
                  </div>
                </div>

                {/* Register Form */}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="text-sm font-medium text-gray-700">
                      Ad Soyad
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Adınız Soyadınız"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                      E-posta Adresi
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="ornek@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-phone" className="text-sm font-medium text-gray-700">
                      Telefon Numarası
                    </Label>
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="0555 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-address" className="text-sm font-medium text-gray-700">
                      Adres
                    </Label>
                    <Input
                      id="register-address"
                      type="text"
                      placeholder="Adresiniz"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                      Şifre
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 p-0 hover:bg-gray-100"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="text-sm font-medium text-gray-700">
                      Şifre Tekrar
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="register-confirm-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive" className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700 text-sm">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        Kayıt Yapılıyor...
                      </div>
                    ) : (
                      'Üye Ol'
                    )}
                  </Button>
                </form>

                {/* Terms */}
                <div className="text-xs text-gray-500 text-center mt-4">
                  Üye olarak <span className="text-green-600">Kullanım Koşulları</span> ve{' '}
                  <span className="text-green-600">Gizlilik Politikası</span>'nı kabul etmiş olursunuz.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}