'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Search, Filter, Edit, Eye, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import AdminLayout from '@/components/admin/admin-layout';
import { adminApi, Product } from '@/lib/api/admin';
import { fallbackProducts, categories } from '@/lib/api/fallback-data';
import ProductFormModal from '@/components/admin/product-form-modal';

export default function AdminProducts() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [apiConnected, setApiConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');

  useEffect(() => {
    // Check if user is admin
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    loadProducts();
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    // Filter products based on search and category
    let filtered = products;
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'Tümü') {
      filtered = filtered.filter(product => {
        const categoryName = typeof product.category === 'string' 
          ? product.category 
          : product.category?.name || '';
        return categoryName === selectedCategory;
      });
    }
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      
      // Try to load from .NET API first
      try {
        const apiProducts = await adminApi.getProducts();
        setProducts(apiProducts);
        setFilteredProducts(apiProducts);
        setApiConnected(true);
        console.log('✅ Products loaded from .NET API');
      } catch (apiError) {
        console.log('⚠️ .NET API not available, using fallback data');
        
        // Fallback to existing API endpoints
        const response = await fetch('/api/products?limit=100');
        if (response.ok) {
          const data = await response.json();
          const localProducts = data.products || [];
          setProducts(localProducts);
          setFilteredProducts(localProducts);
        }
        setApiConnected(false);
      }
    } catch (error) {
      console.error('Products loading error:', error);
      setProducts(fallbackProducts);
      setFilteredProducts(fallbackProducts);
      setApiConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;
    
    try {
      if (apiConnected) {
        await adminApi.deleteProduct(productId);
      } else {
        // Fallback delete logic
        console.log('Delete product:', productId);
      }
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    try {
      if (apiConnected) {
        if (modalMode === 'add') {
          await adminApi.createProduct(productData);
        } else {
          await adminApi.updateProduct(productData.id!, productData);
        }
      } else {
        // Fallback save logic
        console.log('Save product:', productData, 'Mode:', modalMode);
        
        // For demo purposes, just reload the products
        if (modalMode === 'add') {
          console.log('Would create product:', productData);
        } else {
          console.log('Would update product:', productData);
        }
      }
      
      await loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  };

  const getProductStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Pasif</Badge>;
      case 'out_of_stock':
        return <Badge className="bg-red-100 text-red-800">Stok Yok</Badge>;
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>;
    }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <AdminLayout title="Yetkisiz Erişim" subtitle="Bu sayfaya erişim izniniz yok">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <Button onClick={() => router.push('/')}>Ana Sayfaya Dön</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout title="Ürün Yönetimi" subtitle="Yükleniyor...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Ürün Yönetimi" subtitle="Ürünleri düzenle ve yönet">
      {/* API Connection Status */}
      <div className="mb-6">
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          apiConnected 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          {apiConnected ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                ✅ .NET API Bağlantısı Aktif - Gerçek veriler kullanılıyor
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">
                ⚠️ .NET API Bağlantısı Pasif - Örnek veriler kullanılıyor
              </span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtrele
            </Button>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleAddProduct}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Ürün
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Ürünler</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredProducts.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Ürünler</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredProducts.filter(p => p.isActive).length}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Aktif</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Organik Ürünler</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredProducts.length}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Organik</Badge>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Stoktaki Ürünler</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredProducts.filter(p => p.stock > 0).length}</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Stokta</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Ürün Listesi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Ürün</th>
                    <th className="text-left py-3 px-4">Kategori</th>
                    <th className="text-left py-3 px-4">Fiyat</th>
                    <th className="text-left py-3 px-4">Stok</th>
                    <th className="text-left py-3 px-4">Durum</th>
                    <th className="text-left py-3 px-4">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">
                          {typeof product.category === 'string' ? product.category : product.category?.name || 'Bilinmiyor'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">₺{product.price.toFixed(2)}</td>
                      <td className="py-3 px-4">{product.stock}</td>
                      <td className="py-3 px-4">
                        {getProductStatusBadge(product.isActive ? 'active' : 'inactive')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                            <Edit className="w-4 h-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleViewProduct(product)}>
                            <Eye className="w-4 h-4 mr-1" />
                            Gör
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onSave={handleSaveProduct}
        mode={modalMode}
      />
    </AdminLayout>
  );
}