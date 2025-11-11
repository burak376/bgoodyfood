'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Package, 
  MessageSquare, 
  Lightbulb,
  BarChart3,
  Target,
  Zap,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { adminApi } from '@/lib/api/admin';

interface AIInsight {
  id: string;
  type: 'sales' | 'inventory' | 'customer' | 'product';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: string;
}

interface SalesForecast {
  period: string;
  predicted: number;
  confidence: number;
  factors: string[];
}

interface CustomerAnalysis {
  customerId: string;
  customerName: string;
  segment: string;
  churnRisk: number;
  recommendations: string[];
  lifetimeValue: number;
}

export default function AIFeatures() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [salesForecast, setSalesForecast] = useState<SalesForecast | null>(null);
  const [customerAnalysis, setCustomerAnalysis] = useState<CustomerAnalysis[]>([]);
  const [productDescription, setProductDescription] = useState('');
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    try {
      setLoading(true);
      
      // Try to load AI data from .NET API
      try {
        const [forecastData, customerData, inventoryRecs] = await Promise.all([
          adminApi.getSalesForecast('30days'),
          adminApi.getCustomerAnalytics(),
          adminApi.generateInventoryRecommendations()
        ]);
        
        setSalesForecast(forecastData);
        setCustomerAnalysis(customerData);
        setApiConnected(true);
        
        // Generate insights based on the data
        generateInsights(forecastData, customerData, inventoryRecs);
        
      } catch (apiError) {
        console.log('⚠️ AI API not available, using demo data');
        setApiConnected(false);
        loadDemoData();
      }
    } catch (error) {
      console.error('Error loading AI data:', error);
      loadDemoData();
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    // Demo sales forecast
    setSalesForecast({
      period: '30 gün',
      predicted: 125000,
      confidence: 87,
      factors: ['Mevsimsel artış', 'Kampanya etkisi', 'Müşteri memnuniyeti']
    });

    // Demo customer analysis
    setCustomerAnalysis([
      {
        customerId: '1',
        customerName: 'Ahmet Yılmaz',
        segment: 'VIP',
        churnRisk: 15,
        recommendations: ['Özel teklifler gönder', 'Sadakat programına dahil et'],
        lifetimeValue: 5420
      },
      {
        customerId: '2',
        customerName: 'Ayşe Demir',
        segment: 'Regular',
        churnRisk: 35,
        recommendations: ['İndirim kodu gönder', 'Yeni ürünleri tanıt'],
        lifetimeValue: 1890
      }
    ]);

    // Demo insights
    setInsights([
      {
        id: '1',
        type: 'sales',
        title: 'Satışlarda Artış Bekleniyor',
        description: 'Gelecek 30 günde %15 satış artışı tahmin ediliyor. Stok seviyelerini gözden geçirin.',
        impact: 'high',
        actionable: true,
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'inventory',
        title: 'Domates Stokları Azalıyor',
        description: 'Popüler organik domateslerin stokları 3 gün içinde tükenebilir. Tedarikçi ile iletişime geçin.',
        impact: 'high',
        actionable: true,
        timestamp: new Date().toISOString()
      },
      {
        id: '3',
        type: 'customer',
        title: 'Müşteri Kayıp Riski',
        description: '5 müşteri yüksek kayıp riski altında. Hedefli kampanyalar gönderin.',
        impact: 'medium',
        actionable: true,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  const generateInsights = (forecast: any, customers: any, inventory: any) => {
    const newInsights: AIInsight[] = [];
    
    // Sales insights
    if (forecast.predicted > 100000) {
      newInsights.push({
        id: 'sales-1',
        type: 'sales',
        title: 'Yüksek Satış Potansiyeli',
        description: `Gelecek 30 günde ₺${forecast.predicted.toLocaleString()} satış tahmin ediliyor.`,
        impact: 'high',
        actionable: true,
        timestamp: new Date().toISOString()
      });
    }

    // Customer insights
    const highRiskCustomers = customers.filter((c: any) => c.churnRisk > 30);
    if (highRiskCustomers.length > 0) {
      newInsights.push({
        id: 'customer-1',
        type: 'customer',
        title: 'Müşteri Kayıp Riski',
        description: `${highRiskCustomers.length} müşteri kayıp riski altında.`,
        impact: 'medium',
        actionable: true,
        timestamp: new Date().toISOString()
      });
    }

    setInsights(newInsights);
  };

  const generateProductDescription = async () => {
    if (!productName || !productCategory) return;
    
    try {
      setLoading(true);
      const description = await adminApi.generateProductDescription(productName, productCategory);
      setProductDescription(description);
    } catch (error) {
      console.error('Error generating product description:', error);
      setProductDescription(`${productName} için otomatik üretilmiş açıklama. Taze, kaliteli ve organik ${productCategory.toLowerCase()} ürünümüz.`);
    } finally {
      setLoading(false);
    }
  };

  const categorizeFeedback = async () => {
    if (!feedbackText) return;
    
    try {
      setLoading(true);
      const category = await adminApi.categorizeCustomerFeedback(feedbackText);
      setFeedbackCategory(category);
    } catch (error) {
      console.error('Error categorizing feedback:', error);
      setFeedbackCategory('Genel Görüş');
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'sales': return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'inventory': return <Package className="w-5 h-5 text-purple-500" />;
      case 'customer': return <Users className="w-5 h-5 text-green-500" />;
      case 'product': return <Package className="w-5 h-5 text-orange-500" />;
      default: return <Lightbulb className="w-5 h-5 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Status */}
      <div className={`p-4 rounded-lg flex items-center gap-3 ${
        apiConnected 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-yellow-50 border border-yellow-200'
      }`}>
        {apiConnected ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              🤖 AI Özellikleri Aktif - Gerçek zamanlı analizler
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800 font-medium">
              ⚠️ AI Demo Modu - Örnek analizler gösteriliyor
            </span>
          </>
        )}
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            AI Analizleri ve Öngörüler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact === 'high' ? 'Yüksek' : insight.impact === 'medium' ? 'Orta' : 'Düşük'} Etki
                    </Badge>
                    {insight.actionable && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Target className="w-3 h-3 mr-1" />
                        Aksiyon Alınabilir
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{insight.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(insight.timestamp).toLocaleString('tr-TR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sales Forecast */}
      {salesForecast && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Satış Tahmini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tahmini Gelir</p>
                <p className="text-2xl font-bold text-green-600">
                  ₺{salesForecast.predicted.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{salesForecast.period}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Güven Seviyesi</p>
                <p className="text-2xl font-bold text-blue-600">%{salesForecast.confidence}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${salesForecast.confidence}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Etkileyen Faktörler</p>
                <div className="space-y-1">
                  {salesForecast.factors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Analysis */}
      {customerAnalysis.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              Müşteri Analizi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customerAnalysis.map((customer) => (
                <div key={customer.customerId} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{customer.customerName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{customer.segment}</Badge>
                        <span className="text-sm text-gray-500">
                          Ömür Boyu Değer: ₺{customer.lifetimeValue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Kayıp Riski</p>
                      <p className={`text-lg font-bold ${
                        customer.churnRisk > 30 ? 'text-red-600' : 
                        customer.churnRisk > 15 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        %{customer.churnRisk}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Öneriler:</p>
                    <div className="flex flex-wrap gap-2">
                      {customer.recommendations.map((rec, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800">
                          <Lightbulb className="w-3 h-3 mr-1" />
                          {rec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Description Generator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-500" />
              Ürün Açıklaması Oluşturucu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Adı
              </label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Örn: Organik Domates"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori
              </label>
              <Input
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                placeholder="Örn: Sebzeler"
              />
            </div>
            <Button 
              onClick={generateProductDescription}
              disabled={!productName || !productCategory || loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Açıklama Oluştur
            </Button>
            {productDescription && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{productDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feedback Categorizer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              Müşteri Geri Bildirim Analizi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geri Bildirim Metni
              </label>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Müşteri geri bildirimini buraya yazın..."
                rows={3}
              />
            </div>
            <Button 
              onClick={categorizeFeedback}
              disabled={!feedbackText || loading}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Brain className="w-4 h-4 mr-2" />
              )}
              Analiz Et
            </Button>
            {feedbackCategory && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Kategori:</p>
                <Badge className="mt-1">{feedbackCategory}</Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}