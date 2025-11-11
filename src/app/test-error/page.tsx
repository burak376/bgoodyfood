'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function TestErrorPage() {
  const triggerClipboardError = () => {
    // 尝试触发剪贴板错误
    if (navigator.clipboard) {
      navigator.clipboard.writeText('test').catch(err => {
        console.log('Clipboard error caught:', err)
      })
    }
  }

  const triggerNormalError = () => {
    // 触发一个普通错误
    throw new Error('This is a test error')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">
              Hata Test Sayfası
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-gray-600">
              Bu sayfa, hata yönlendirme sistemini test etmek için kullanılır.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={triggerClipboardError}
                variant="outline"
                className="h-16"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Pano Hatası Test Et
              </Button>
              
              <Button 
                onClick={triggerNormalError}
                variant="destructive"
                className="h-16"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Normal Hata Test Et
              </Button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Not:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Pano hatası tarayıcı güvenlik politikası tarafından engellenmelidir</li>
                <li>• Normal hata ErrorBoundary tarafından yakalanmalıdır</li>
                <li>• Her iki durumda da uygulama çökmemelidir</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}