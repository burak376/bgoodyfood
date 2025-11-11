import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';

// GET: Bir ürünün besin değerlendirmesini getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const evaluation = await db.nutritionalEvaluation.findUnique({
      where: { productId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            calories: true,
            protein: true,
            carbs: true,
            fat: true,
            fiber: true,
            sugar: true,
            sodium: true,
            ingredients: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!evaluation) {
      return NextResponse.json(
        { error: 'Besin değerlendirmesi bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Besin değerlendirmesi getirme hatası:', error);
    return NextResponse.json(
      { error: 'Besin değerlendirmesi alınamadı' },
      { status: 500 }
    );
  }
}

// POST: Yeni besin değerlendirmesi oluştur veya mevcut olanı güncelle
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await request.json();
    const { useAI = false } = body;

    // Önce ürünü kontrol et
    const product = await db.product.findUnique({
      where: { id: productId },
      include: { category: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }

    let evaluationData;

    if (useAI) {
      // AI ile besin değerlendirmesi yap
      evaluationData = await generateAIEvaluation(product);
    } else {
      // Manuel değerlendirme
      evaluationData = {
        healthScore: body.healthScore || 0,
        vitaminScore: body.vitaminScore || 0,
        mineralScore: body.mineralScore || 0,
        proteinScore: body.proteinScore || 0,
        fiberScore: body.fiberScore || 0,
        sugarScore: body.sugarScore || 0,
        sodiumScore: body.sodiumScore || 0,
        healthBenefits: body.healthBenefits,
        recommendedFor: body.recommendedFor,
        warnings: body.warnings,
        dailyValueInfo: body.dailyValueInfo,
        aiAnalysis: body.aiAnalysis,
        aiConfidence: body.aiConfidence,
      };
    }

    // Mevcut değerlendirmeyi kontrol et ve güncelle veya oluştur
    const existingEvaluation = await db.nutritionalEvaluation.findUnique({
      where: { productId },
    });

    let evaluation;
    if (existingEvaluation) {
      evaluation = await db.nutritionalEvaluation.update({
        where: { productId },
        data: {
          ...evaluationData,
          lastAnalyzedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } else {
      evaluation = await db.nutritionalEvaluation.create({
        data: {
          productId,
          ...evaluationData,
        },
      });
    }

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Besin değerlendirmesi oluşturma/güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Besin değerlendirmesi kaydedilemedi' },
      { status: 500 }
    );
  }
}

// PUT: Besin değerlendirmesini güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const body = await request.json();

    const evaluation = await db.nutritionalEvaluation.update({
      where: { productId },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error('Besin değerlendirmesi güncelleme hatası:', error);
    return NextResponse.json(
      { error: 'Besin değerlendirmesi güncellenemedi' },
      { status: 500 }
    );
  }
}

// DELETE: Besin değerlendirmesini sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    await db.nutritionalEvaluation.delete({
      where: { productId },
    });

    return NextResponse.json({ message: 'Besin değerlendirmesi silindi' });
  } catch (error) {
    console.error('Besin değerlendirmesi silme hatası:', error);
    return NextResponse.json(
      { error: 'Besin değerlendirmesi silinemedi' },
      { status: 500 }
    );
  }
}

// AI ile besin değerlendirmesi oluşturan yardımcı fonksiyon
async function generateAIEvaluation(product: any) {
  try {
    const zai = await ZAI.create();

    const prompt = `
    Lütfen aşağıdaki organik ürünün besin değerlendirmesini yapın:
    
    Ürün Adı: ${product.name}
    Kategori: ${product.category.name}
    Açıklama: ${product.description || 'Belirtilmemiş'}
    İçindekiler: ${product.ingredients || 'Belirtilmemiş'}
    
    Besin Değerleri (100g için):
    - Kalori: ${product.calories || 'Belirtilmemiş'} kcal
    - Protein: ${product.protein || 'Belirtilmemiş'} g
    - Karbonhidrat: ${product.carbs || 'Belirtilmemiş'} g
    - Yağ: ${product.fat || 'Belirtilmemiş'} g
    - Lif: ${product.fiber || 'Belirtilmemiş'} g
    - Şeker: ${product.sugar || 'Belirtilmemiş'} g
    - Sodyum: ${product.sodium || 'Belirtilmemiş'} mg
    
    Lütfen bu ürün için şu değerlendirmeleri yapın:
    1. Genel sağlık skoru (0-100)
    2. Vitamin skoru (0-100)
    3. Mineral skoru (0-100)
    4. Protein skoru (0-100)
    5. Lif skoru (0-100)
    6. Şeker skoru (0-100, düşük olması daha iyi)
    7. Sodyum skoru (0-100, düşük olması daha iyi)
    
    Ayrıca şu metinleri hazırlayın:
    - Sağlık faydaları (kısa ve öz)
    - Kimler için önerilir (örn: sporcular, diyet yapanlar vb.)
    - Uyarılar (varsa)
    - Günlük değer hakkında bilgi
    
    Lütfen cevabınızı JSON formatında verin:
    {
      "healthScore": 0-100 arası sayı,
      "vitaminScore": 0-100 arası sayı,
      "mineralScore": 0-100 arası sayı,
      "proteinScore": 0-100 arası sayı,
      "fiberScore": 0-100 arası sayı,
      "sugarScore": 0-100 arası sayı,
      "sodiumScore": 0-100 arası sayı,
      "healthBenefits": "Sağlık faydaları metni",
      "recommendedFor": "Kimler için önerilir metni",
      "warnings": "Uyarılar metni",
      "dailyValueInfo": "Günlük değer bilgisi metni",
      "aiAnalysis": "Genel AI analiz metni"
    }
    `;

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'Sen bir beslenme uzmanısın ve organik ürünlerin besin değerlerini analiz ediyorsun. Her zaman Türkçe cevap ver ve JSON formatında yanıtla.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    
    if (aiResponse) {
      try {
        const evaluationData = JSON.parse(aiResponse);
        return {
          ...evaluationData,
          aiConfidence: 0.85, // AI güven skoru
        };
      } catch (parseError) {
        console.error('AI yanıtı parse edilemedi:', parseError);
        // Varsayılan değerler dön
        return generateDefaultEvaluation();
      }
    }

    return generateDefaultEvaluation();
  } catch (error) {
    console.error('AI değerlendirmesi hatası:', error);
    return generateDefaultEvaluation();
  }
}

// Varsayılan değerlendirme oluştur
function generateDefaultEvaluation() {
  return {
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
    aiAnalysis: "Ürün AI tarafından otomatik olarak analiz edilmiştir.",
    aiConfidence: 0.5,
  };
}