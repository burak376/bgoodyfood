'use client'

import { useCartStore } from '@/stores/cart-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart } from 'lucide-react'

export default function TestCartPage() {
  const { addItem, getTotalItems, items } = useCartStore()
  const cartItemCount = getTotalItems()

  const testProduct = {
    id: 'test-1',
    name: 'Test Ürün',
    price: 10.99,
    image: 'https://via.placeholder.com/100x100',
    description: 'Bu bir test ürünüdür'
  }

  const handleAddToCart = async () => {
    console.log('Test: Adding product to cart', testProduct)
    try {
      await addItem(testProduct)
      console.log('Test: Product added successfully')
      alert('Ürün sepete eklendi!')
    } catch (error) {
      console.error('Test: Error adding product', error)
      alert('Hata: ' + (error as Error).message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sepet Test Sayfası</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Test Product */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Test Ürünü</h2>
              <div className="space-y-4">
                <div>
                  <strong>Ad:</strong> {testProduct.name}
                </div>
                <div>
                  <strong>Fiyat:</strong> ₺{testProduct.price}
                </div>
                <div>
                  <strong>ID:</strong> {testProduct.id}
                </div>
                <Button 
                  onClick={handleAddToCart}
                  className="w-full"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Sepete Ekle
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cart Status */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Sepet Durumu</h2>
              <div className="space-y-4">
                <div>
                  <strong>Sepet Sayısı:</strong> {cartItemCount}
                </div>
                <div>
                  <strong>Ürünler:</strong>
                </div>
                {items.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2">
                    {items.map((item, index) => (
                      <li key={index}>
                        {item.name} - {item.quantity} adet - ₺{item.price}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Sepet boş</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Debug Info */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Debug Bilgileri</h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-auto">
                {JSON.stringify({
                  cartItemCount,
                  itemsCount: items.length,
                  items: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                  }))
                }, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}