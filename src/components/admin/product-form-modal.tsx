'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Product } from '@/lib/api/admin';
import { categories } from '@/lib/api/fallback-data';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (product: Partial<Product>) => void;
  mode: 'add' | 'edit' | 'view';
}

export default function ProductFormModal({ 
  isOpen, 
  onClose, 
  product, 
  onSave, 
  mode 
}: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    isActive: true,
    isOrganic: true,
    isFeatured: false,
    sku: '',
    imageUrl: '',
    unit: 'kg',
    minOrderQuantity: 1
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product && mode === 'edit') {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        stock: product.stock || 0,
        category: typeof product.category === 'string' ? product.category : product.category?.name || '',
        isActive: product.isActive ?? true,
        isOrganic: product.isOrganic ?? true,
        isFeatured: product.isFeatured ?? false,
        sku: product.sku || '',
        imageUrl: product.imageUrl || '',
        unit: product.unit || 'kg',
        minOrderQuantity: product.minOrderQuantity || 1
      });
    } else if (mode === 'add') {
      // Reset form for new product
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category: '',
        isActive: true,
        isOrganic: true,
        isFeatured: false,
        sku: '',
        imageUrl: '',
        unit: 'kg',
        minOrderQuantity: 1
      });
    }
  }, [product, mode, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const productData = {
        ...formData,
        id: mode === 'edit' ? product?.id : undefined,
        category: formData.category
      };

      await onSave(productData);
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isViewMode = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {mode === 'add' && 'Yeni Ürün Ekle'}
              {mode === 'edit' && 'Ürün Düzenle'}
              {mode === 'view' && 'Ürün Detayları'}
            </span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Temel Bilgiler</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Ürün Adı *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isViewMode}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  disabled={isViewMode}
                  placeholder="Otomatik oluşturulacak"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={isViewMode}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="unit">Birim</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleInputChange('unit', value)}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="adet">Adet</SelectItem>
                    <SelectItem value="litre">Litre (L)</SelectItem>
                    <SelectItem value="demet">Demet</SelectItem>
                    <SelectItem value="paket">Paket</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing and Stock */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fiyat ve Stok</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Fiyat (₺) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  disabled={isViewMode}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="stock">Stok Miktarı *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                  disabled={isViewMode}
                  required
                />
              </div>

              <div>
                <Label htmlFor="minOrderQuantity">Min. Sipariş Miktarı</Label>
                <Input
                  id="minOrderQuantity"
                  type="number"
                  min="1"
                  value={formData.minOrderQuantity}
                  onChange={(e) => handleInputChange('minOrderQuantity', parseInt(e.target.value))}
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>

          {/* Product Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ürün Özellikleri</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Aktif Ürün</Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  disabled={isViewMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isOrganic">Organik Ürün</Label>
                <Switch
                  id="isOrganic"
                  checked={formData.isOrganic}
                  onCheckedChange={(checked) => handleInputChange('isOrganic', checked)}
                  disabled={isViewMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Öne Çıkan Ürün</Label>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                  disabled={isViewMode}
                />
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ürün Görseli</h3>
            
            <div>
              <Label htmlFor="imageUrl">Görsel URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                disabled={isViewMode}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Ürün görseli"
                  className="w-32 h-32 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop&crop=center';
                  }}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {isViewMode ? 'Kapat' : 'İptal'}
            </Button>
            
            {!isViewMode && (
              <Button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? 'Kaydediliyor...' : (mode === 'add' ? 'Ürün Ekle' : 'Kaydet')}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}