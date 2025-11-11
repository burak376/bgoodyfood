import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get user session from cookie or auth header
    const authHeader = request.headers.get('authorization')
    const userId = authHeader?.replace('Bearer ', '') || 'demo-user'

    // For demo purposes, return dummy data
    // In production, you would fetch from database:
    // const user = await db.user.findUnique({ where: { id: userId } })
    
    const dummyProfile = {
      id: userId,
      name: 'Ahmet Yılmaz',
      email: 'ahmet.yilmaz@example.com',
      phone: '+90 555 123 45 67',
      address: 'İstanbul, Kadıköy, Caferağa Mah. No:123',
      avatar: null,
      membershipType: 'premium',
      accountStatus: 'active',
      joinDate: '2023-01-15',
      totalOrders: 47,
      totalSpent: 2850.75,
      savedAddresses: [
        {
          id: '1',
          title: 'Ev Adresi',
          address: 'İstanbul, Kadıköy, Caferağa Mah. No:123',
          isDefault: true
        },
        {
          id: '2',
          title: 'İş Adresi',
          address: 'İstanbul, Şişli, Mecidiyeköy Mah. No:456',
          isDefault: false
        }
      ],
      preferences: {
        newsletter: true,
        smsNotifications: false,
        emailNotifications: true,
        language: 'tr'
      }
    }

    return NextResponse.json(dummyProfile)
  } catch (error) {
    console.error('Profile API error:', error)
    return NextResponse.json(
      { error: 'Profil bilgileri alınamadı' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, address } = body

    // Get user session
    const authHeader = request.headers.get('authorization')
    const userId = authHeader?.replace('Bearer ', '') || 'demo-user'

    // For demo purposes, just return success
    // In production, you would update the database:
    // await db.user.update({ where: { id: userId }, data: { name, email, phone, address } })

    return NextResponse.json({
      success: true,
      message: 'Profil bilgileri güncellendi',
      data: { name, email, phone, address }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Profil güncellenemedi' },
      { status: 500 }
    )
  }
}