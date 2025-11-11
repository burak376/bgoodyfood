import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// GET - Tüm kampanya modallarını getir
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const campaigns = await db.campaignModal.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(campaigns)
  } catch (error) {
    console.error('Campaigns fetch error:', error)
    return NextResponse.json(
      { error: 'Kampanyalar alınamadı' },
      { status: 500 }
    )
  }
}

// POST - Yeni kampanya modalı oluştur
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const data = await request.json()
    
    const campaign = await db.campaignModal.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        isActive: data.isActive,
        discount: data.discount,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        targetAudience: data.targetAudience,
        priority: data.priority
      }
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    console.error('Campaign create error:', error)
    return NextResponse.json(
      { error: 'Kampanya oluşturulamadı' },
      { status: 500 }
    )
  }
}