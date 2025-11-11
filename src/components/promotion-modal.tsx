'use client';

import { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

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

export function PromotionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalSettings, setModalSettings] = useState<ModalSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Modal ayarlarını getir
    const fetchModalSettings = async () => {
      try {
        const response = await fetch('/api/modal-settings');
        const data = await response.json();
        
        if (data && data.isActive) {
          setModalSettings(data);
          
          // Local storage'da modalın daha önce gösterilip gösterilmediğini kontrol et
          const modalShown = localStorage.getItem('promotion-modal-shown');
          if (!modalShown) {
            setIsOpen(true);
            // Modalın gösterildiğini kaydet
            localStorage.setItem('promotion-modal-shown', 'true');
          }
        }
      } catch (error) {
        console.error('Modal ayarları alınırken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModalSettings();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    if (modalSettings?.buttonLink) {
      window.location.href = modalSettings.buttonLink;
    }
    handleClose();
  };

  if (isLoading || !modalSettings || !isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="relative">
          {/* Kapatma butonu */}
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/80 p-2 hover:bg-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Modal içeriği */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 text-center">
            {/* İkon veya görsel */}
            <div className="mb-6 flex justify-center">
              {modalSettings.imageUrl ? (
                <img
                  src={modalSettings.imageUrl}
                  alt={modalSettings.title}
                  className="h-32 w-32 object-cover rounded-full"
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-100">
                  <Gift className="h-16 w-16 text-green-600" />
                </div>
              )}
            </div>

            {/* Başlık */}
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              {modalSettings.title}
            </h2>

            {/* Açıklama */}
            {modalSettings.description && (
              <p className="mb-6 text-gray-600">
                {modalSettings.description}
              </p>
            )}

            {/* İndirim bilgisi */}
            {modalSettings.discount && (
              <div className="mb-6 inline-flex items-center rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-800">
                %{modalSettings.discount} İNDİRİM
              </div>
            )}

            {/* Buton */}
            <Button
              onClick={handleButtonClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              {modalSettings.buttonText || 'Alışverişe Başla'}
            </Button>

            {/* Küçük not */}
            <p className="mt-4 text-xs text-gray-500">
              İlk siparişiniz için geçerlidir
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}