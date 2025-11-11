'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Gift, Image, Settings, Eye, EyeOff, Save, Upload } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';

interface ModalSettings {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  discount?: number;
  buttonText?: string;
  buttonLink?: string;
}

export default function ModalSettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalSettings, setModalSettings] = useState<ModalSettings>({
    title: 'İlk Siparişinize Özel İndirim!',
    description: 'Organik yaşam tarzına başlangıcınızı kutluyoruz! İlk siparişinizde %10 indirim kazanın.',
    imageUrl: '',
    isActive: true,
    discount: 10,
    buttonText: 'Alışverişe Başla',
    buttonLink: '/products'
  });

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      router.push('/admin/login');
      return;
    }

    loadModalSettings();
  }, [user, router]);

  const loadModalSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/modal-settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setModalSettings(data);
        }
      }
    } catch (error) {
      console.error('Modal ayarları yüklenirken hata:', error);
      toast({
        title: 'Hata',
        description: 'Modal ayarları yüklenemedi',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('admin_token');
      const url = modalSettings.id ? '/api/modal-settings' : '/api/modal-settings';
      const method = modalSettings.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(modalSettings)
      });

      if (response.ok) {
        const data = await response.json();
        setModalSettings(data);
        toast({
          title: 'Başarılı',
          description: 'Modal ayarları başarıyla kaydedildi'
        });
      } else {
        throw new Error('Kaydetme başarısız');
      }
    } catch (error) {
      console.error('Modal ayarları kaydedilirken hata:', error);
      toast({
        title: 'Hata',
        description: 'Modal ayarları kaydedilemedi',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Burada normalde bir upload işlemi yapılır
      // Şimdilik örnek bir URL kullanıyoruz
      const reader = new FileReader();
      reader.onloadend = () => {
        setModalSettings(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Promosyon Modal Ayarları" subtitle="Yükleniyor...">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Settings className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
            <p>Yükleniyor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Promosyon Modal Ayarları" subtitle="Ana sayfada görünen promosyon modalını yönetin">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ayarlar Kartı */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Modal Ayarları
              </CardTitle>
              <CardDescription>
                Promosyon modalının genel ayarlarını yapılandırın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Modal Durumu */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Modal Durumu</Label>
                  <p className="text-sm text-gray-500">
                    Modalın gösterilip gösterilmeyeceğini belirler
                  </p>
                </div>
                <Switch
                  checked={modalSettings.isActive}
                  onCheckedChange={(checked) =>
                    setModalSettings(prev => ({ ...prev, isActive: checked }))
                  }
                />
              </div>

              {/* Başlık */}
              <div className="space-y-2">
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  value={modalSettings.title}
                  onChange={(e) =>
                    setModalSettings(prev => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Modal başlığı"
                />
              </div>

              {/* Açıklama */}
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={modalSettings.description}
                  onChange={(e) =>
                    setModalSettings(prev => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Modal açıklaması"
                  rows={3}
                />
              </div>

              {/* İndirim Oranı */}
              <div className="space-y-2">
                <Label htmlFor="discount">İndirim Oranı (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={modalSettings.discount || ''}
                  onChange={(e) =>
                    setModalSettings(prev => ({ 
                      ...prev, 
                      discount: e.target.value ? parseFloat(e.target.value) : undefined 
                    }))
                  }
                  placeholder="10"
                />
              </div>

              {/* Buton Metni */}
              <div className="space-y-2">
                <Label htmlFor="buttonText">Buton Metni</Label>
                <Input
                  id="buttonText"
                  value={modalSettings.buttonText}
                  onChange={(e) =>
                    setModalSettings(prev => ({ ...prev, buttonText: e.target.value }))
                  }
                  placeholder="Alışverişe Başla"
                />
              </div>

              {/* Buton Linki */}
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Buton Linki</Label>
                <Input
                  id="buttonLink"
                  value={modalSettings.buttonLink}
                  onChange={(e) =>
                    setModalSettings(prev => ({ ...prev, buttonLink: e.target.value }))
                  }
                  placeholder="/products"
                />
              </div>

              {/* Kaydet Butonu */}
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <Settings className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </CardContent>
          </Card>

          {/* Görsel ve Önizleme Kartı */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" alt="Settings icon" />
                Görsel ve Önizleme
              </CardTitle>
              <CardDescription>
                Modal görselini yükleyin ve önizleme yapın
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Görsel Yükleme */}
              <div className="space-y-2">
                <Label htmlFor="image">Modal Görseli</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {modalSettings.imageUrl ? (
                    <div className="space-y-4">
                      <img
                        src={modalSettings.imageUrl}
                        alt="Modal görseli önizlemesi"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('image')?.click()}
                        className="w-full"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Görseli Değiştir
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Gift className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Görsel yüklemek için tıklayın
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById('image')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Görsel Yükle
                        </Button>
                      </div>
                    </div>
                  )}
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Önizleme */}
              <div className="space-y-2">
                <Label>Önizleme</Label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="text-center space-y-3">
                    {/* Durum Badge'i */}
                    <div className="flex justify-center">
                      <Badge variant={modalSettings.isActive ? "default" : "secondary"}>
                        {modalSettings.isActive ? (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Pasif
                          </>
                        )}
                      </Badge>
                    </div>

                    {/* Görsel veya İkon */}
                    <div className="flex justify-center">
                      {modalSettings.imageUrl ? (
                        <img
                          src={modalSettings.imageUrl}
                          alt="Modal görseli küçük önizleme"
                          className="w-20 h-20 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                          <Gift className="w-10 h-10 text-green-600" />
                        </div>
                      )}
                    </div>

                    {/* Başlık */}
                    <h3 className="font-semibold text-gray-900">
                      {modalSettings.title || 'Başlık yok'}
                    </h3>

                    {/* Açıklama */}
                    {modalSettings.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {modalSettings.description}
                      </p>
                    )}

                    {/* İndirim */}
                    {modalSettings.discount && (
                      <div className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                        %{modalSettings.discount} İNDİRİM
                      </div>
                    )}

                    {/* Buton */}
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={!modalSettings.isActive}
                    >
                      {modalSettings.buttonText || 'Buton metni'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bilgi Kartı */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Bilgi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Modal, kullanıcıların sayfayı ilk ziyaretinde gösterilir</p>
              <p>• Modalı kapatan kullanıcılar tekrar görmeyecektir (localStorage ile)</p>
              <p>• Modal durumu pasif olduğunda hiçbir kullanıcıya gösterilmez</p>
              <p>• Görsel yüklemek için dosya seçeneğini kullanabilirsiniz</p>
              <p>• Değişiklikleri kaydetmeyi unutmayın!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}