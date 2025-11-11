import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST: Çoklu ürün besin değerlendirmesi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds, useAI = false } = body;

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Ürün ID listesi gereklidir' },
        { status: 400 }
      );
    }

    const results = [];

    for (const productId of productIds) {
      try {
        // Önce ürünü kontrol et
        const product = await db.product.findUnique({
          where: { id: productId },
          include: { category: true },
        });

        if (!product) {
          results.push({
            productId,
            success: false,
            error: 'Ürün bulunamadı',
          });
          continue;
        }

        // Mevcut değerlendirmeyi kontrol et
        const existingEvaluation = await db.nutritionalEvaluation.findUnique({
          where: { productId },
        });

        if (useAI) {
          // AI ile değerlendirme yap
          const evaluationResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/nutritional-evaluation/${productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ useAI: true }),
          });

          if (evaluationResponse.ok) {
            const evaluation = await evaluationResponse.json();
            results.push({
              productId,
              success: true,
              evaluation,
            });
          } else {
            results.push({
              productId,
              success: false,
              error: 'AI değerlendirmesi başarısız',
            });
          }
        } else {
          // Varsayılan değerlendirme oluştur
          const defaultEvaluation = {
            healthScore: 50,
            vitaminScore: 50,
            mineralScore: 50,
            proteinScore: 50,
            fiberScore: 50,
            sugarScore: 50,
            sodiumScore: 50,
            healthBenefits: "Organik ürün doğal ve sağlıklı bir seçenektir.",
            recommendedFor: "Sağlıklı yaşam tarzını benimseyen herkes için uygundur.",
            warnings: "Herhangi bir bilinen uyarı bulunmamaktadır.",
            dailyValueInfo: "Günlük besin ihtiyaçlarınızın bir parçası olarak tüketilebilir.",
            aiAnalysis: "Ürün otomatik olarak analiz edilmiştir.",
            aiConfidence: 0.5,
          };

          let evaluation;
          if (existingEvaluation) {
            evaluation = await db.nutritionalEvaluation.update({
              where: { productId },
              data: {
                ...defaultEvaluation,
                lastAnalyzedAt: new Date(),
                updatedAt: new Date(),
              },
            });
          } else {
            evaluation = await db.nutritionalEvaluation.create({
              data: {
                productId,
                ...defaultEvaluation,
              },
            });
          }

          results.push({
            productId,
            success: true,
            evaluation,
          });
        }
      } catch (error) {
        console.error(`Ürün ${productId} değerlendirme hatası:`, error);
        results.push({
          productId,
          success: false,
          error: 'Değerlendirme sırasında hata oluştu',
        });
      }
    }

    return NextResponse.json({
      message: 'Çoklu değerlendirme tamamlandı',
      results,
      summary: {
        total: productIds.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
      },
    });
  } catch (error) {
    console.error('Çoklu besin değerlendirmesi hatası:', error);
    return NextResponse.json(
      { error: 'Çoklu değerlendirme yapılamadı' },
      { status: 500 }
    );
  }
}

// GET: Tüm besin değerlendirmelerini listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const skip = (page - 1) * limit;

    const evaluations = await db.nutritionalEvaluation.findMany({
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            image: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const total = await db.nutritionalEvaluation.count();

    return NextResponse.json({
      evaluations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Besin değerlendirmeleri listeleme hatası:', error);
    return NextResponse.json(
      { error: 'Değerlendirmeler alınamadı' },
      { status: 500 }
    );
  }
}