import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: addressId } = await params
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

    // For demo purposes, just return success with updated data
    // In production, you would update in database:
    // const updatedAddress = await db.address.update({
    //   where: { id: addressId, userId },
    //   data: { title, address, isDefault, updatedAt: new Date() }
    // })

    const updatedAddress = {
      id: addressId,
      title,
      address,
      isDefault: isDefault || false,
      createdAt: '2023-01-15',
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error('Update address error:', error)
    return NextResponse.json(
      { error: 'Adres güncellenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: addressId } = await params

    // Get user session
    const authHeader = request.headers.get('authorization')
    const userId = authHeader?.replace('Bearer ', '') || 'demo-user'

    // For demo purposes, just return success
    // In production, you would delete from database:
    // await db.address.delete({ where: { id: addressId, userId } })

    return NextResponse.json({
      success: true,
      message: 'Adres başarıyla silindi'
    })
  } catch (error) {
    console.error('Delete address error:', error)
    return NextResponse.json(
      { error: 'Adres silinemedi' },
      { status: 500 }
    )
  }
}