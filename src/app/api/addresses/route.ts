import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get user session from cookie or auth header
    const authHeader = request.headers.get('authorization')
    const userId = authHeader?.replace('Bearer ', '') || 'demo-user'

    // For demo purposes, return dummy data
    // In production, you would fetch from database:
    // const addresses = await db.address.findMany({ where: { userId } })
    
    const dummyAddresses = [
      {
        id: '1',
        title: 'Ev Adresi',
        address: 'İstanbul, Kadıköy, Caferağa Mah. No:123',
        isDefault: true,
        createdAt: '2023-01-15',
        updatedAt: '2023-01-15'
      },
      {
        id: '2',
        title: 'İş Adresi',
        address: 'İstanbul, Şişli, Mecidiyeköy Mah. No:456',
        isDefault: false,
        createdAt: '2023-02-20',
        updatedAt: '2023-02-20'
      }
    ]

    return NextResponse.json(dummyAddresses)
  } catch (error) {
    console.error('Addresses API error:', error)
    return NextResponse.json(
      { error: 'Adresler alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, address, isDefault } = body

    // Validate required fields
    if (!title || !address) {
      return NextResponse.json(
        { error: 'Başlık ve adres alanları zorunludur' },
        { status: 400 }
      )
    }

    // Get user session
    const authHeader = request.headers.get('authorization')
    const userId = authHeader?.replace('Bearer ', '') || 'demo-user'

    // For demo purposes, generate a new address and return it
    // In production, you would create in database:
    // const newAddress = await db.address.create({
    //   data: { userId, title, address, isDefault: isDefault || false }
    // })

    const newAddress = {
      id: Date.now().toString(),
      title,
      address,
      isDefault: isDefault || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(newAddress, { status: 201 })
  } catch (error) {
    console.error('Create address error:', error)
    return NextResponse.json(
      { error: 'Adres eklenemedi' },
      { status: 500 }
    )
  }
}