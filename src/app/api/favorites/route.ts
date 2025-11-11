import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get user session from cookie or auth header
    const authHeader = request.headers.get('authorization')
    const userId = authHeader?.replace('Bearer ', '') || 'demo-user'

    // For demo purposes, return dummy data
    // In production, you would fetch from database:
    // const favorites = await db.favorite.findMany({ 
    //   where: { userId },
    //   include: { product: true }
    // })

    const dummyFavorites = [
      {
        id: '1',
        productId: '1',
        name: 'Organik Domates',
        price: 25.99,
        image: 'https://images.unsplash.com/photo-1542931287-023b9333a1c5?w=200&h=200&fit=crop&crop=center',
        rating: 4.5,
        reviews: 128,
        description: 'Taze organik domatesler, gübre ve pestisit kullanılmadan yetiştirilmiştir.',
        inStock: true,
        category: 'Sebzeler',
        addedDate: '2024-01-10'
      },
      {
        id: '2',
        productId: '2',
        name: 'Organik Elma',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop&crop=center',
        rating: 4.8,
        reviews: 256,
        description: 'Vitamin dolu organik elmalar, doğal yöntemlerle yetiştirilmiştir.',
        inStock: true,
        category: 'Meyveler',
        addedDate: '2024-01-12'
      },
      {
        id: '3',
        productId: '3',
        name: 'Organik Ispanak',
        price: 12.75,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&h=200&fit=crop&crop=center',
        rating: 4.3,
        reviews: 89,
        description: 'Taze organik ıspanak, demir ve vitamin açısından zengindir.',
        inStock: false,
        category: 'Sebzeler',
        addedDate: '2024-01-08'
      },
      {
        id: '4',
        productId: '4',
        name: 'Organik Bal',
        price: 55.75,
        image: 'https://images.unsplash.com/photo-1587049352846-2a1e883de4e4?w=200&h=200&fit=crop&crop=center',
        rating: 4.9,
        reviews: 342,
        description: 'Doğal ve saf organik bal, katkı maddesi içermez.',
        inStock: true,
        category: 'Süt Ürünleri',
        addedDate: '2024-01-15'
      },
      {
        id: '5',
        productId: '5',
        name: 'Organik Yumurta',
        price: 32.50,
        image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=200&h=200&fit=crop&crop=center',
        rating: 4.7,
        reviews: 198,
        description: 'Serbest dolaşan tavuklardan organik yumurtalar.',
        inStock: true,
        category: 'Süt Ürünleri',
        addedDate: '2024-01-18'
      },
      {
        id: '6',
        productId: '6',
        name: 'Organik Portakal',
        price: 22.25,
        image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop&crop=center',
        rating: 4.6,
        reviews: 167,
        description: 'C vitamini dolu organik portakallar.',
        inStock: true,
        category: 'Meyveler',
        addedDate: '2024-01-20'
      }
    ]

    return NextResponse.json(dummyFavorites)
  } catch (error) {
    console.error('Favorites API error:', error)
    return NextResponse.json(
      { error: 'Favoriler alınamadı' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId } = body

    // Get user session
    const authHeader = request.headers.get('authorization')
    const userId = authHeader?.replace('Bearer ', '') || 'demo-user'

    // For demo purposes, just return success
    // In production, you would add to database:
    // await db.favorite.create({ data: { userId, productId } })

    return NextResponse.json({
      success: true,
      message: 'Ürün favorilere eklendi'
    })
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json(
      { error: 'Favori eklenemedi' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      )
    }

    // Get user session
    const authHeader = request.headers.get('authorization')
    const userId = authHeader?.replace('Bearer ', '') || 'demo-user'

    // For demo purposes, just return success
    // In production, you would delete from database:
    // await db.favorite.delete({ where: { userId_productId: { userId, productId } } })

    return NextResponse.json({
      success: true,
      message: 'Ürün favorilerden kaldırıldı'
    })
  } catch (error) {
    console.error('Remove favorite error:', error)
    return NextResponse.json(
      { error: 'Favori kaldırılamadı' },
      { status: 500 }
    )
  }
}