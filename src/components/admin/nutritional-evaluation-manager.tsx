'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertCircle, 
  CheckCircle, 
  Heart, 
  Shield, 
  Zap, 
  Apple,
  TrendingUp,
  AlertTriangle,
  Info,
  RefreshCw,
  Brain,
  BarChart3
} from 'lucide-react';

interface NutritionalEvaluation {
  id: string;
  productId: string;
  healthScore: number;
  vitaminScore: number;
  mineralScore: number;
  proteinScore: number;
  fiberScore: number;
  sugarScore: number;
  sodiumScore: number;
  healthBenefits?: string;
  recommendedFor?: string;
  warnings?: string;
  dailyValueInfo?: string;
  aiAnalysis?: string;
  aiConfidence?: number;
  lastAnalyzedAt: string;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    image?: string;
    category: {
      name: string;
    };
  };
}

interface NutritionalEvaluationManagerProps {
  productId: string;
  productName: string;
  onEvaluationUpdate?: () => void;
}

export default function NutritionalEvaluationManager({
  productId,
  productName,
  onEvaluationUpdate
}: NutritionalEvaluationManagerProps) {
  const [evaluation, setEvaluation] = useState<NutritionalEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    healthScore: 50,
    vitaminScore: 50,
    mineralScore: 50,
    proteinScore: 50,
    fiberScore: 50,
    sugarScore: 50,
    sodiumScore: 50,
    healthBenefits: '',
    recommendedFor: '',
    warnings: '',
    dailyValueInfo: '',
  });

  useEffect(() => {
    fetchEvaluation();
  }, [productId]);

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/nutritional-evaluation/${productId}`);
      
      if (response.ok) {
        const data = await response.json();
        setEvaluation(data);
        setFormData({
          healthScore: data.healthScore,
          vitaminScore: data.vitaminScore,
          mineralScore: data.mineralScore,
          proteinScore: data.proteinScore,
          fiberScore: data.fiberScore,
          sugarScore: data.sugarScore,
          sodiumScore: data.sodiumScore,
          healthBenefits: data.healthBenefits || '',
          recommendedFor: data.recommendedFor || '',
          warnings: data.warnings || '',
          dailyValueInfo: data.dailyValueInfo || '',
        });
      }
    } catch (error) {
      console.error('Değerlendirme getirme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAIAnalysis = async () => {
    try {
      setAiAnalyzing(true);
      const response = await fetch(`/api/nutritional-evaluation/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ useAI: true }),
      });

      if (response.ok) {
        const data = await response.json();
        setEvaluation(data);
        setFormData({
          healthScore: data.healthScore,
          vitaminScore: data.vitaminScore,
          mineralScore: data.mineralScore,
          proteinScore: data.proteinScore,
          fiberScore: data.fiberScore,
          sugarScore: data.sugarScore,
          sodiumScore: data.sodiumScore,
          healthBenefits: data.healthBenefits || '',
          recommendedFor: data.recommendedFor || '',
          warnings: data.warnings || '',
          dailyValueInfo: data.dailyValueInfo || '',
        });
        onEvaluationUpdate?.();
      }
    } catch (error) {
      console.error('AI analizi hatası:', error);
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/nutritional-evaluation/${productId}`, {
        method: evaluation ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setEvaluation(data);
        onEvaluationUpdate?.();
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error);
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  const ScoreCard = ({ title, score, icon: Icon, description }: any) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">{title}</span>
          </div>
          <div className="flex items-center gap-1">
            {getScoreIcon(score)}
            <span className={`font-bold ${getScoreColor(score)}`}>{score}</span>
          </div>
        </div>
        <Progress value={score} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span className="ml-2">Yükleniyor...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Besin Değerlendirmesi - {productName}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleAIAnalysis}
                disabled={aiAnalyzing}
                className="flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                {aiAnalyzing ? 'AI Analiz Ediyor...' : 'AI ile Analiz Et'}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="scores">Skorlar</TabsTrigger>
          <TabsTrigger value="details">Detaylar</TabsTrigger>
          <TabsTrigger value="analysis">AI Analiz</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ScoreCard
              title="Sağlık Skoru"
              score={formData.healthScore}
              icon={Heart}
              description="Genel sağlık değeri"
            />
            <ScoreCard
              title="Vitamin Skoru"
              score={formData.vitaminScore}
              icon={Apple}
              description="Vitamin içeriği"
            />
            <ScoreCard
              title="Protein Skoru"
              score={formData.proteinScore}
              icon={Zap}
              description="Protein değeri"
            />
            <ScoreCard
              title="Lif Skoru"
              score={formData.fiberScore}
              icon={Shield}
              description="Lif içeriği"
            />
          </div>

          {evaluation?.aiAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Analizi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{evaluation.aiAnalysis}</p>
                {evaluation.aiConfidence && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Güven Skoru:</span>
                    <Badge variant="outline">
                      {Math.round(evaluation.aiConfidence * 100)}%
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scores" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="healthScore">Sağlık Skoru (0-100)</Label>
                <Input
                  id="healthScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.healthScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, healthScore: parseInt(e.target.value) || 0 }))}
                />
                <Progress value={formData.healthScore} className="mt-2" />
              </div>

              <div>
                <Label htmlFor="vitaminScore">Vitamin Skoru (0-100)</Label>
                <Input
                  id="vitaminScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.vitaminScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, vitaminScore: parseInt(e.target.value) || 0 }))}
                />
                <Progress value={formData.vitaminScore} className="mt-2" />
              </div>

              <div>
                <Label htmlFor="mineralScore">Mineral Skoru (0-100)</Label>
                <Input
                  id="mineralScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.mineralScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, mineralScore: parseInt(e.target.value) || 0 }))}
                />
                <Progress value={formData.mineralScore} className="mt-2" />
              </div>

              <div>
                <Label htmlFor="proteinScore">Protein Skoru (0-100)</Label>
                <Input
                  id="proteinScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.proteinScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, proteinScore: parseInt(e.target.value) || 0 }))}
                />
                <Progress value={formData.proteinScore} className="mt-2" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="fiberScore">Lif Skoru (0-100)</Label>
                <Input
                  id="fiberScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.fiberScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, fiberScore: parseInt(e.target.value) || 0 }))}
                />
                <Progress value={formData.fiberScore} className="mt-2" />
              </div>

              <div>
                <Label htmlFor="sugarScore">Şeker Skoru (0-100, düşük iyi)</Label>
                <Input
                  id="sugarScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.sugarScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, sugarScore: parseInt(e.target.value) || 0 }))}
                />
                <Progress value={formData.sugarScore} className="mt-2" />
              </div>

              <div>
                <Label htmlFor="sodiumScore">Sodyum Skoru (0-100, düşük iyi)</Label>
                <Input
                  id="sodiumScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.sodiumScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, sodiumScore: parseInt(e.target.value) || 0 }))}
                />
                <Progress value={formData.sodiumScore} className="mt-2" />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Sağlık Faydaları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Ürünün sağlık faydalarını girin..."
                  value={formData.healthBenefits}
                  onChange={(e) => setFormData(prev => ({ ...prev, healthBenefits: e.target.value }))}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Önerilen Durumlar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Bu ürün kimler için önerilir..."
                  value={formData.recommendedFor}
                  onChange={(e) => setFormData(prev => ({ ...prev, recommendedFor: e.target.value }))}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Uyarılar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Varsa uyarıları girin..."
                  value={formData.warnings}
                  onChange={(e) => setFormData(prev => ({ ...prev, warnings: e.target.value }))}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Günlük Değer Bilgisi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Günlük değer hakkında bilgi..."
                  value={formData.dailyValueInfo}
                  onChange={(e) => setFormData(prev => ({ ...prev, dailyValueInfo: e.target.value }))}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {evaluation?.aiAnalysis ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Analiz Sonuçları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Analiz Metni</h4>
                  <p className="text-sm bg-muted p-3 rounded">{evaluation.aiAnalysis}</p>
                </div>
                
                {evaluation.aiConfidence && (
                  <div>
                    <h4 className="font-medium mb-2">Güven Skoru</h4>
                    <div className="flex items-center gap-2">
                      <Progress value={evaluation.aiConfidence * 100} className="flex-1" />
                      <span className="text-sm font-medium">
                        {Math.round(evaluation.aiConfidence * 100)}%
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Son Analiz Tarihi</h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(evaluation.lastAnalyzedAt).toLocaleString('tr-TR')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Brain className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium mb-2">AI Analizi Yapılmamış</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bu ürün için henüz AI analizi yapılmamış.
                </p>
                <Button onClick={handleAIAnalysis} disabled={aiAnalyzing}>
                  {aiAnalyzing ? 'Analiz Ediliyor...' : 'AI Analizi Başlat'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}