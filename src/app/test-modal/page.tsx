'use client';

import { PromotionModal } from '@/components/promotion-modal';

export default function TestModalPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Promosyon Modal Test Sayfası</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Modal Test</h2>
          <p className="text-gray-600 mb-4">
            Bu sayfa promosyon modalını test etmek için kullanılır. 
            Modal, sayfa yüklendiğinde otomatik olarak görünmelidir.
          </p>
          
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Not:</strong> Modalı daha önce gördüyseniz tekrar görünmeyecektir. 
              Modalı tekrar görmek için localStorage temizleyin.
            </p>
          </div>
        </div>

        {/* Modalı burada çağırıyoruz */}
        <PromotionModal />
      </div>
    </div>
  );
}