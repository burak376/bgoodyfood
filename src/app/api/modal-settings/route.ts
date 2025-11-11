import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { initModalSettings } from '@/lib/init-modal-settings';

// GET - Tüm modal ayarlarını getir
export async function GET() {
  try {
    // Initialize modal settings if they don't exist
    await initModalSettings();
    
    const modalSettings = await db.modalSettings.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(modalSettings);
  } catch (error) {
    console.error('Modal ayarları alınırken hata:', error);
    return NextResponse.json(
      { error: 'Modal ayarları alınamadı' },
      { status: 500 }
    );
  }
}

// POST - Yeni modal ayarları oluştur
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const modalSettings = await db.modalSettings.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        discount: data.discount,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
      },
    });

    return NextResponse.json(modalSettings);
  } catch (error) {
    console.error('Modal ayarları oluşturulurken hata:', error);
    return NextResponse.json(
      { error: 'Modal ayarları oluşturulamadı' },
      { status: 500 }
    );
  }
}

// PUT - Modal ayarlarını güncelle
export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id, ...updateData } = data;
    
    const modalSettings = await db.modalSettings.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(modalSettings);
  } catch (error) {
    console.error('Modal ayarları güncellenirken hata:', error);
    return NextResponse.json(
      { error: 'Modal ayarları güncellenemedi' },
      { status: 500 }
    );
  }
}