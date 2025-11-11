import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Ürün resimleri için harita
const productImageMap: { [key: string]: string } = {
  'elma': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=200&fit=crop&crop=center',
  'portakal': 'https://images.unsplash.com/photo-1547514701-42782101795e?w=300&h=200&fit=crop&crop=center',
  'domates': 'https://images.unsplash.com/photo-1546470427-e92b2c9c09d6?w=300&h=200&fit=crop&crop=center',
  'salatalik': 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=200&fit=crop&crop=center',
  'havuc': 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=200&fit=crop&crop=center',
  'patates': 'https://images.unsplash.com/photo-1518977676801-b59923885d65?w=300&h=200&fit=crop&crop=center',
  'sogan': 'https://images.unsplash.com/photo-1523042188836-38c5adbf75fd?w=300&h=200&fit=crop&crop=center',
  'sarimsak': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop&crop=center',
  'tavuk': 'https://images.unsplash.com/photo-1604500769972-87aa6c3f5350?w=300&h=200&fit=crop&crop=center',
  'yumurta': 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=300&h=200&fit=crop&crop=center',
  'süt': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=200&fit=crop&crop=center',
  'peynir': 'https://images.unsplash.com/photo-1486477633314-348a8c215d47?w=300&h=200&fit=crop&crop=center',
  'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop&crop=center',
  'bal': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop&crop=center',
  'recel': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=200&fit=crop&crop=center',
  'nohut': 'https://images.unsplash.com/photo-1526318628604-3c5c5b562f0d?w=300&h=200&fit=crop&crop=center',
  'mercimek': 'https://images.unsplash.com/photo-1526318628604-3c5c5b562f0d?w=300&h=200&fit=crop&crop=center',
  'pirinc': 'https://images.unsplash.com/photo-1536304993881-ff6e9afefa3a?w=300&h=200&fit=crop&crop=center',
  'bulgur': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop&crop=center'
}

// Ürün adına göre resim URL'i getir
function getProductImage(productName: string): string {
  const name = productName.toLowerCase();
  
  // Ürün adında geçen anahtar kelimelere göre resim seç
  for (const [key, url] of Object.entries(productImageMap)) {
    if (name.includes(key)) {
      return url;
    }
  }
  
  // Varsayılan resim
  return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop&crop=center';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isActive: true
    }

    if (category) {
      where.category = {
        slug: category
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // Get products
    const products = await db.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take: limit
    })

    // Ürün resimlerini güncelle
    const updatedProducts = products.map(product => ({
      ...product,
      image: getProductImage(product.name)
    }))

    // Get total count for pagination
    const total = await db.product.count({ where })

    // Get categories for filters
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: { isActive: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      products: updatedProducts,
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const product = await db.product.create({
      data: {
        name: body.name,
        description: body.description,
        shortDesc: body.shortDesc,
        price: body.price,
        image: body.image,
        images: body.images ? JSON.stringify(body.images) : null,
        stock: body.stock,
        sku: body.sku,
        categoryId: body.categoryId,
        isOrganic: body.isOrganic ?? true,
        isFeatured: body.isFeatured ?? false,
        isActive: body.isActive ?? true,
        
        // Besin değerleri
        calories: body.calories,
        protein: body.protein,
        carbs: body.carbs,
        fat: body.fat,
        fiber: body.fiber,
        sugar: body.sugar,
        sodium: body.sodium,
        
        // Saklama koşulları
        storageConditions: body.storageConditions,
        shelfLife: body.shelfLife,
        storageTemp: body.storageTemp,
        
        // Ek bilgiler
        origin: body.origin,
        allergens: body.allergens,
        ingredients: body.ingredients,
      },
      include: {
        category: true
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Create Product Error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}