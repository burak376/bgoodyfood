'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Brain,
  BarChart3,
  Package,
  Loader2,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import NutritionalBatchEvaluation from '@/components/admin/nutritional-batch-evaluation';
import NutritionalEvaluationManager from '@/components/admin/nutritional-evaluation-manager';
import AdminLayout from '@/components/admin/admin-layout';

export default function NutritionalEvaluationAdmin() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('batch');

  useEffect(() => {
    // Check if user is admin
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    loadProducts();
  }, [isAuthenticated, user, router]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?limit=100');
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Products loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluationUpdate = () => {
    // Refresh data when evaluation is updated
    loadProducts();
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <AdminLayout title="Yetkisiz Erişim" subtitle="Bu sayfaya erişim izniniz yok">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <Button onClick={() => router.push('/')}>Ana Sayfaya Dön</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout 
        title="Besin Değerlendirmesi" 
        subtitle="Yükleniyor..."
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </AdminLayout>
    );
  }

  const stats = {
    total: products.length,
    withAI: products.filter(p => p.description).length,
    organic: products.filter(p => p.isOrganic).length,
    evaluated: 0, // This would come from API
  };

  return (
    <AdminLayout 
      title="Besin Değerlendirmesi" 
      subtitle="Ürünlerin besin değerlerini analiz edin ve yönetin"
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-blue-500">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Toplam Ürünler</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-purple-500">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <Activity className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">AI Destekli</p>
                <p className="text-2xl font-bold text-gray-900">{stats.withAI}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-green-500">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <BarChart3 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Organik Ürünler</p>
                <p className="text-2xl font-bold text-gray-900">{stats.organic}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-orange-500">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Aktif
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Değerlendirilen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.evaluated}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="batch" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600">
              <BarChart3 className="w-4 h-4" />
              Çoklu Değerlendirme
            </TabsTrigger>
            <TabsTrigger value="single" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600">
              <Heart className="w-4 h-4" />
              Tekil Değerlendirme
            </TabsTrigger>
          </TabsList>

          <TabsContent value="batch" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Çoklu Besin Değerlendirmesi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <NutritionalBatchEvaluation />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="single" className="space-y-6">
            {/* Product Selector */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle>Ürün Seçimi</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedProduct?.id === product.id
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sku}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {product.category?.name}
                            </Badge>
                            {product.isOrganic && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Organik
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Single Product Evaluation */}
            {selectedProduct && (
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    {selectedProduct.name} - Besin Değerlendirmesi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <NutritionalEvaluationManager
                    productId={selectedProduct.id}
                    productName={selectedProduct.name}
                    onEvaluationUpdate={handleEvaluationUpdate}
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}