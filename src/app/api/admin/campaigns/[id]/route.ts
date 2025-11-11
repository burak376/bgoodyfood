import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// PUT - Kampanya modalını güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const data = await request.json()
    const campaignId = params.id

    const campaign = await db.campaignModal.update({
      where: { id: campaignId },
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
        priority: data.priority,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(campaign)
  } catch (error) {
    console.error('Campaign update error:', error)
    return NextResponse.json(
      { error: 'Kampanya güncellenemedi' },
      { status: 500 }
    )
  }
}

// DELETE - Kampanya modalını sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }

    const campaignId = params.id

    await db.campaignModal.delete({ where: { id: campaignId } })

    return NextResponse.json({
      success: true,
      message: 'Kampanya başarıyla silindi'
    })
  } catch (error) {
    console.error('Campaign delete error:', error)
    return NextResponse.json(
      { error: 'Kampanya silinemedi' },
      { status: 500 }
    )
  }
}