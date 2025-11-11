'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  AlertCircle, 
  Brain,
  RefreshCw,
  Play,
  List,
  BarChart3,
  Filter
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  image?: string;
  category: {
    name: string;
  };
  nutritionalEvaluation?: {
    id: string;
    healthScore: number;
    lastAnalyzedAt: string;
  };
}

interface BatchResult {
  productId: string;
  success: boolean;
  error?: string;
  evaluation?: any;
}

export default function NutritionalBatchEvaluation() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [useAI, setUseAI] = useState(false);
  const [filter, setFilter] = useState<'all' | 'evaluated' | 'not-evaluated'>('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?limit=100');
      
      if (response.ok) {
        const data = await response.json();
        
        // Her ürün için besin değerlendirmesini kontrol et
        const productsWithEvaluation = await Promise.all(
          data.products.map(async (product: Product) => {
            try {
              const evalResponse = await fetch(`/api/nutritional-evaluation/${product.id}`);
              if (evalResponse.ok) {
                const evaluation = await evalResponse.json();
                return { ...product, nutritionalEvaluation: evaluation };
              }
              return product;
            } catch {
              return product;
            }
          })
        );
        
        setProducts(productsWithEvaluation);
      }
    } catch (error) {
      console.error('Ürünler getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  const handleBatchEvaluation = async () => {
    if (selectedProducts.length === 0) return;

    try {
      setEvaluating(true);
      setResults([]);
      setShowResults(false);

      const response = await fetch('/api/nutritional-evaluation/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: selectedProducts,
          useAI,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setShowResults(true);
        
        // Ürün listesini güncelle
        await fetchProducts();
      }
    } catch (error) {
      console.error('Çoklu değerlendirme hatası:', error);
    } finally {
      setEvaluating(false);
    }
  };

  const filteredProducts = products.filter(product => {
    switch (filter) {
      case 'evaluated':
        return !!product.nutritionalEvaluation;
      case 'not-evaluated':
        return !product.nutritionalEvaluation;
      default:
        return true;
    }
  });

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getEvaluationStatus = (product: Product) => {
    if (product.nutritionalEvaluation) {
      const daysSinceAnalysis = Math.floor(
        (new Date().getTime() - new Date(product.nutritionalEvaluation.lastAnalyzedAt).getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceAnalysis > 30) {
        return { status: 'outdated', text: `${daysSinceAnalysis} gün önce`, color: 'text-yellow-600' };
      }
      return { status: 'current', text: 'Güncel', color: 'text-green-600' };
    }
    return { status: 'none', text: 'Değerlendirme yok', color: 'text-gray-500' };
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="ml-2">Ürünler yükleniyor...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Çoklu Besin Değerlendirmesi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="select-all"
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all">Tümünü Seç ({selectedProducts.length}/{filteredProducts.length})</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="use-ai"
                  checked={useAI}
                  onCheckedChange={(checked) => setUseAI(checked as boolean)}
                />
                <Label htmlFor="use-ai" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Analizi Kullan
                </Label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter('all')}
                className={filter === 'all' ? 'bg-primary text-primary-foreground' : ''}
              >
                <List className="w-4 h-4 mr-1" />
                Tümü ({products.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter('evaluated')}
                className={filter === 'evaluated' ? 'bg-primary text-primary-foreground' : ''}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Değerlendirilen ({products.filter(p => p.nutritionalEvaluation).length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilter('not-evaluated')}
                className={filter === 'not-evaluated' ? 'bg-primary text-primary-foreground' : ''}
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                Değerlendirilmeyen ({products.filter(p => !p.nutritionalEvaluation).length})
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleBatchEvaluation}
              disabled={selectedProducts.length === 0 || evaluating}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {evaluating ? 'Değerlendiriliyor...' : `Seçili ${selectedProducts.length} Ürünü Değerlendir`}
            </Button>
            
            <Button
              variant="outline"
              onClick={fetchProducts}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Listeyi Yenile
            </Button>
          </div>

          {evaluating && (
            <Alert>
              <Brain className="w-4 h-4" />
              <AlertDescription>
                {useAI ? 'AI destekli besin değerlendirmesi yapılıyor...' : 'Besin değerlendirmesi yapılıyor...'}
                Bu işlem biraz zaman alabilir.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ürün Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredProducts.map((product) => {
              const evaluationStatus = getEvaluationStatus(product);
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                    />
                    
                    <div className="flex items-center gap-3">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.category.name} • {product.sku}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {product.nutritionalEvaluation && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          Skor: {product.nutritionalEvaluation.healthScore}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${getHealthScoreColor(product.nutritionalEvaluation.healthScore)}`} />
                      </div>
                    )}
                    
                    <Badge variant="outline" className={evaluationStatus.color}>
                      {evaluationStatus.text}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {showResults && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Değerlendirme Sonuçları
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {results.filter(r => r.success).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Başarılı</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">
                    {results.filter(r => !r.success).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Başarısız</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {results.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Toplam</p>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map((result, index) => {
                  const product = products.find(p => p.id === result.productId);
                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-2 rounded ${
                        result.success ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-sm">
                          {product?.name || result.productId}
                        </span>
                      </div>
                      
                      {result.success ? (
                        <Badge variant="outline" className="text-green-600">
                          Başarılı
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          {result.error}
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}