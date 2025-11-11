import { db } from '@/lib/db';

export async function initModalSettings() {
  try {
    // Check if modal settings already exist
    const existingSettings = await db.modalSettings.findFirst();
    
    if (!existingSettings) {
      // Create default modal settings
      const defaultSettings = await db.modalSettings.create({
        data: {
          title: 'İlk Siparişinize Özel İndirim!',
          description: 'Organik yaşam tarzına başlangıcınızı kutluyoruz! İlk siparişinizde %10 indirim kazanın.',
          imageUrl: '',
          isActive: true,
          discount: 10,
          buttonText: 'Alışverişe Başla',
          buttonLink: '/products'
        }
      });
      
      console.log('Default modal settings created:', defaultSettings);
      return defaultSettings;
    }
    
    return existingSettings;
  } catch (error) {
    console.error('Error initializing modal settings:', error);
    throw error;
  }
}