'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Leaf, Heart, CheckCircle, AlertCircle, Users, Globe, Truck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Iletisim() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "✅ Mesajınız Gönderildi!",
        description: "En kısa sürede size dönüş yapacağız.",
      })
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      toast({
        title: "❌ Hata",
        description: "Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/20 to-green-500/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full px-6 py-3 text-sm font-semibold mb-8 shadow-lg">
              <MessageCircle className="w-5 h-5" />
              <span>7/24 Destek</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-gray-900">İletişim</span>
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">BGoodyFood</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
              Sorularınız, önerileriniz veya siparişlerinizle ilgili her konuda 
              <span className="font-semibold text-green-600"> size özel destek ekibimiz</span> 
              her zaman hazır. Bize ulaşın, sağlıklı yaşam together!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Telefon</h3>
                <p className="text-gray-600 mb-4">Bizi arayın, yardımcı olalım!</p>
                <div className="space-y-2">
                  <p className="text-green-600 font-semibold">0850 123 45 67</p>
                  <p className="text-sm text-gray-500">Hafta içi: 09:00 - 18:00</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">E-posta</h3>
                <p className="text-gray-600 mb-4">7/24 online destek</p>
                <div className="space-y-2">
                  <p className="text-blue-600 font-semibold">info@bgoodyfood.com</p>
                  <p className="text-sm text-gray-500">destek@bgoodyfood.com</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Adres</h3>
                <p className="text-gray-600 mb-4">Mağazalarımızı ziyaret edin</p>
                <div className="space-y-2">
                  <p className="text-orange-600 font-semibold">İstanbul Merkez</p>
                  <p className="text-sm text-gray-500">Levent, Büyükdere Cad. No:123</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full px-6 py-3 text-sm font-semibold mb-6 shadow-lg">
                <Send className="w-5 h-5" />
                <span>Bize Ulaşın</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Mesaj <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Gönderin</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Sorularınızı ve geri bildirimlerinizi bizimle paylaşın. 
                En kısa sürede size dönüş yapacağız.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="border-0 shadow-xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Adınız Soyadınız *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
                          placeholder="Adınızı girin"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          E-posta Adresiniz *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefon Numaranız
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
                        placeholder="0555 123 45 67"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konu *
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full h-12 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl"
                        placeholder="Mesaj konusu"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mesajınız *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 rounded-xl resize-none p-3"
                        placeholder="Mesajınızı buraya yazın..."
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Mesajı Gönder
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Map & Info */}
              <div className="space-y-8">
                <Card className="border-0 shadow-xl overflow-hidden">
                  <div className="aspect-video bg-gray-200 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-500/20">
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <MapPin className="w-16 h-16 text-green-600 mx-auto mb-4" />
                          <p className="text-lg font-semibold text-gray-800">Harita Yükleniyor</p>
                          <p className="text-gray-600">İstanbul Merkez Mağaza</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="border-0 shadow-xl">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Çalışma Saatlerimiz</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-900">Hafta İçi</span>
                        </div>
                        <span className="text-gray-600">09:00 - 18:00</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">Cumartesi</span>
                        </div>
                        <span className="text-gray-600">10:00 - 16:00</span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-red-600" />
                          </div>
                          <span className="font-medium text-gray-900">Pazar</span>
                        </div>
                        <span className="text-gray-600">Kapalı</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-green-600 to-emerald-600 text-white">
                  <CardContent className="p-8 text-center">
                    <Heart className="w-12 h-12 text-white/80 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-3">Acil Durum?</h3>
                    <p className="text-white/90 mb-6">
                      7/24 WhatsApp destek hattımızdan bize ulaşabilirsiniz.
                    </p>
                    <Button 
                      variant="outline" 
                      className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-xl transition-all duration-300"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp Destek
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full px-6 py-3 text-sm font-semibold mb-6 shadow-lg">
              <AlertCircle className="w-5 h-5" />
              <span>Sıkça Sorulan Sorular</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Merak Ettiğiniz <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Her Şey</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Siparişlerim ne zaman ulaşır?</h3>
                    <p className="text-gray-600">
                      İstanbul içi siparişler aynı gün, diğer şehirlere 1-3 iş günü içinde teslim edilir. 
                      Hafta içi 15:00'e kadar verilen siparişler aynı gün kargoya verilir.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ürünleriniz gerçekten organik mi?</h3>
                    <p className="text-gray-600">
                      Evet, tüm ürünlerimiz %100 organik sertifikalıdır. Tarım Bakanlığı onaylı 
                      sertifikalarımız mevcuttur ve ürünlerimiz düzenli olarak denetlenir.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">İade politikası nedir?</h3>
                    <p className="text-gray-600">
                      Memnun kalmadığınız ürünleri 15 gün içinde iade edebilirsiniz. 
                      Bozuk veya yanlış ürünler için ücretsiz değişim yapılır.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}