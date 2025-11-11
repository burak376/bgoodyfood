'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Leaf, Users, Award, Globe, Heart, Clock, MapPin, CheckCircle, Truck, Shield, Sparkles, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Hakkimizda() {
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
              <Leaf className="w-5 h-5" />
              <span>15+ Yıllık Deneyim</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="text-gray-900">BGoodyFood</span>
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Hakkımızda</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
              2008 yılından beri doğal ve organik ürünlerle sağlıklı bir yaşam tarzı sunuyoruz. 
              <span className="font-semibold text-green-600"> Kalite, güven ve sürdürülebilirlik</span> ilkelerimizle 
              Türkiye'nin dört bir yanına ulaşıyoruz.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Leaf className="w-5 h-5 mr-2" />
                  Ürünlerimizi Keşfedin
                </Button>
              </Link>
              <Link href="/iletisim">
                <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300">
                  <Heart className="w-5 h-5 mr-2" />
                  İletişime Geçin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
              <div className="text-gray-600 font-medium">Yıllık Deneyim</div>
            </div>
            
            <div className="text-center group">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Organik Ürün</div>
            </div>
            
            <div className="text-center group">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600 font-medium">Mutlu Müşteri</div>
            </div>
            
            <div className="text-center group">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">81</div>
              <div className="text-gray-600 font-medium">Şehir</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full px-6 py-3 text-sm font-semibold mb-6 shadow-lg">
                <Sparkles className="w-5 h-5" />
                <span>Bizim Hikayemiz</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Doğadan <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Sofranıza</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                2008 yılında küçük bir aile işletmesi olarak başlayan yolculuğumuz, bugün Türkiye'nin 
                önde gelen organik ürün tedarikçilerinden biri oldu.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Kalite Anlayışı</h3>
                        <p className="text-gray-600">
                          Her ürünümüzü en sıkı kalite standartlarına göre seçiyor ve 
                          %100 organik sertifikalı tedarikçilerle çalışıyoruz.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Güvenilirlik</h3>
                        <p className="text-gray-600">
                          15 yıllık tecrübemizle müşterilerimize sadece en taze ve en kaliteli 
                          ürünleri sunmayı taahhüt ediyoruz.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Müşteri Memnuniyeti</h3>
                        <p className="text-gray-600">
                          50.000'den fazla mutlu müşterimiz, bizim için en büyük referanstır. 
                          Her zaman en iyi hizmeti sunmak için çalışıyoruz.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="aspect-square">
                    <img 
                      src="/hero-bg.jpg" 
                      alt="BGoodyFood Hikayemiz" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <Award className="w-6 h-6 text-yellow-500" />
                        <span className="text-lg font-semibold text-gray-800">Ödüllü Hizmet</span>
                      </div>
                      <p className="text-gray-600">
                        2023 yılında "Yılın Organik Ürün Tedarikçisi" ödülünün sahibi olduk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full px-6 py-3 text-sm font-semibold mb-6 shadow-lg">
              <Heart className="w-5 h-5" />
              <span>Değerlerimiz</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Bizi <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Özel Kılan</span> Değerler
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Doğallık</h3>
                <p className="text-gray-600">
                  Hiçbir kimyasal katkı madde içermeyen, tamamen doğal ürünler sunuyoruz.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Güven</h3>
                <p className="text-gray-600">
                  Müşterilerimize şeffaf ve güvenilir bir alışveriş deneyimi sunuyoruz.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Hız</h3>
                <p className="text-gray-600">
                  Aynı gün teslimat ile en taze ürünleri kapınıza getiriyoruz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-emerald-600">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Sağlıklı Yaşam <span className="text-yellow-300">Bugün Başlar!</span>
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              BGoodyFood ailesine katılın ve organik ürünlerin farkını yaşayın. 
              İlk siparişinizde özel indirim sizi bekliyor!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Alışverişe Başla
                </Button>
              </Link>
              <Link href="/iletisim">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-300">
                  <MapPin className="w-5 h-5 mr-2" />
                  Mağazalarımız
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}