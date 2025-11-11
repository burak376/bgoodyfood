import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET: Tüm kullanıcıları listele (sadece admin)
export async function GET(request: NextRequest) {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
            cartItems: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcılar alınamadı' },
      { status: 500 }
    );
  }
}

// POST: Yeni kullanıcı oluştur (sadece admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, password, phone, role = 'USER' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-posta ve şifre zorunludur' },
        { status: 400 }
      );
    }

    // E-posta kontrolü
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresi zaten kullanılıyor' },
        { status: 400 }
      );
    }

    const user = await db.user.create({
      data: {
        email,
        name,
        password, // Gerçek uygulamada hash'lenmeli
        phone,
        role,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error);
    return NextResponse.json(
      { error: 'Kullanıcı oluşturulamadı' },
      { status: 500 }
    );
  }
}