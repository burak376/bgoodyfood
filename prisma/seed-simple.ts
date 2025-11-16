import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const meyveler = await prisma.category.upsert({
    where: { slug: 'meyveler' },
    update: {},
    create: {
      name: 'Meyveler',
      slug: 'meyveler',
      description: 'Taze organik meyveler',
      image: '/categories/fruits.jpg'
    }
  })

  const sebzeler = await prisma.category.upsert({
    where: { slug: 'sebzeler' },
    update: {},
    create: {
      name: 'Sebzeler',
      slug: 'sebzeler',
      description: 'Doğal organik sebzeler',
      image: '/categories/vegetables.jpg'
    }
  })

  const bakliyat = await prisma.category.upsert({
    where: { slug: 'bakliyat' },
    update: {},
    create: {
      name: 'Bakliyat',
      slug: 'bakliyat',
      description: 'Sağlıklı bakliyat ürünleri',
      image: '/icons/legumes-icon.png'
    }
  })

  const sutUrunleri = await prisma.category.upsert({
    where: { slug: 'sut-urunleri' },
    update: {},
    create: {
      name: 'Süt Ürünleri',
      slug: 'sut-urunleri',
      description: 'Taze süt ve süt ürünleri',
      image: '/icons/meat-icon.png'
    }
  })

  const etTavuk = await prisma.category.upsert({
    where: { slug: 'et-tavuk' },
    update: {},
    create: {
      name: 'Et & Tavuk',
      slug: 'et-tavuk',
      description: 'Organik et ve tavuk ürünleri',
      image: '/icons/meat-icon.png'
    }
  })

  const balRecel = await prisma.category.upsert({
    where: { slug: 'bal-recel' },
    update: {},
    create: {
      name: 'Bal & Reçel',
      slug: 'bal-recel',
      description: 'Doğal bal ve reçeller',
      image: '/products/honey.jpg'
    }
  })

  console.log('✅ Categories created')

  // Create products with nutritional info
  const products = [
    // MEYVELER
    {
      name: 'Organik Elma',
      shortDesc: 'Taptaze kırmızı organik elma',
      description: 'Türkiye\'nin en verimli topraklarında yetiştirilen organik elmalarımız, hiçbir kimyasal gübre veya pestisit kullanılmadan üretilmektedir. Kırmızı ve gevrek, taptaze. Yüksek lif içeriği ve antioksidan özelliği ile sağlıklı atıştırmalıkların vazgeçilmezi.',
      price: 32.50,
      image: '/products/apple.jpg',
      stock: 150,
      sku: 'ORG-ELMA-001',
      categoryId: meyveler.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Isparta, Türkiye',
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
      fiber: 2.4,
      sugar: 10,
      sodium: 1,
      ingredients: 'Organik Elma',
      allergens: 'Yok',
      storageConditions: 'Serin ve kuru yerde saklayın',
      shelfLife: '2 hafta',
      storageTemp: '2-8°C'
    },
    {
      name: 'Organik Portakal',
      shortDesc: 'C vitamini deposu',
      description: 'Akdeniz güneşinin bereketli topraklarında yetişen organik portakallarımız, doğal tatları ve yüksek C vitamini içerikleriyle sağlığınıza katkı sağlar.',
      price: 28.90,
      image: 'https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg',
      stock: 120,
      sku: 'ORG-PORT-001',
      categoryId: meyveler.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Mersin, Türkiye',
      calories: 47,
      protein: 0.9,
      carbs: 12,
      fat: 0.1,
      fiber: 2.4,
      sugar: 9,
      sodium: 0
    },
    {
      name: 'Organik Muz',
      shortDesc: 'Doğal enerji kaynağı',
      description: 'Tropik iklimde yetiştirilen organik muzlar, potasyum ve magnezyum açısından zengin. Sporcuların ve aktif yaşam süren herkesin enerji deposu.',
      price: 42.90,
      image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg',
      stock: 90,
      sku: 'ORG-MUZ-001',
      categoryId: meyveler.id,
      isOrganic: true,
      isFeatured: false,
      isActive: true,
      origin: 'Ekvador',
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
      sodium: 1
    },
    {
      name: 'Organik Çilek',
      shortDesc: 'Tatlı ve sulu organik çilek',
      description: 'Bahçemizde özenle yetiştirilen organik çileklerimiz, aroması ve tatlılığıyla damak tadınızı şenlendirecek. Vitamin C açısından zengin.',
      price: 55.00,
      image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg',
      stock: 40,
      sku: 'ORG-CIL-001',
      categoryId: meyveler.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Bursa, Türkiye',
      calories: 32,
      protein: 0.7,
      carbs: 8,
      fat: 0.3,
      fiber: 2,
      sugar: 5,
      sodium: 1
    },
    {
      name: 'Organik Üzüm',
      shortDesc: 'Çekirdeksiz tatlı üzüm',
      description: 'Bağlarımızda doğal yöntemlerle yetiştirilen çekirdeksiz organik üzümler. Antioksidan rezervuarı resveratrol açısından zengin.',
      price: 38.50,
      image: 'https://images.pexels.com/photos/708777/pexels-photo-708777.jpeg',
      stock: 65,
      sku: 'ORG-UZU-001',
      categoryId: meyveler.id,
      isOrganic: true,
      isFeatured: false,
      isActive: true,
      origin: 'Manisa, Türkiye',
      calories: 69,
      protein: 0.7,
      carbs: 18,
      fat: 0.2,
      fiber: 0.9,
      sugar: 16,
      sodium: 2
    },

    // SEBZELER
    {
      name: 'Organik Domates',
      shortDesc: 'Taze sera domatesi',
      description: 'Serada yetiştirilen doğal domatesler, hiçbir hormon kullanılmadan. Likopen açısından zengin, kalp sağlığına katkı sağlar.',
      price: 18.90,
      image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
      stock: 200,
      sku: 'ORG-DOM-001',
      categoryId: sebzeler.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Antalya, Türkiye',
      calories: 18,
      protein: 0.9,
      carbs: 3.9,
      fat: 0.2,
      fiber: 1.2,
      sugar: 2.6,
      sodium: 5
    },
    {
      name: 'Organik Salatalık',
      shortDesc: 'Gevrek taze salatalık',
      description: 'Taze ve gevrek organik salatalıklar, sağlıklı beslenmenin vazgeçilmezi. %95 su içeriği ile doğal hidratasyon kaynağı.',
      price: 15.90,
      image: 'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg',
      stock: 150,
      sku: 'ORG-SAL-001',
      categoryId: sebzeler.id,
      isOrganic: true,
      isFeatured: false,
      isActive: true,
      origin: 'Muğla, Türkiye',
      calories: 16,
      protein: 0.7,
      carbs: 3.6,
      fat: 0.1,
      fiber: 0.5,
      sugar: 1.7,
      sodium: 2
    },
    {
      name: 'Organik Havuç',
      shortDesc: 'Beta karoten deposu',
      description: 'Toprak altında doğal olarak büyüyen organik havuçlarımız, A vitamini ve beta karoten açısından zengin. Göz sağlığına katkı sağlar.',
      price: 22.50,
      image: 'https://images.pexels.com/photos/3650647/pexels-photo-3650647.jpeg',
      stock: 130,
      sku: 'ORG-HAV-001',
      categoryId: sebzeler.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Konya, Türkiye',
      calories: 41,
      protein: 0.9,
      carbs: 10,
      fat: 0.2,
      fiber: 2.8,
      sugar: 5,
      sodium: 69
    },
    {
      name: 'Organik Ispanak',
      shortDesc: 'Demir deposu yeşil yaprak',
      description: 'Taze organik ıspanak yaprakları, demir, kalsiyum ve folik asit açısından zengin. Yemeklerde, börek ve mantı içlerinde kullanılabilir.',
      price: 25.00,
      image: '/products/vegetables.jpg',
      stock: 80,
      sku: 'ORG-ISP-001',
      categoryId: sebzeler.id,
      isOrganic: true,
      isFeatured: false,
      isActive: true,
      origin: 'İzmir, Türkiye',
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
      fiber: 2.2,
      sugar: 0.4,
      sodium: 79
    },
    {
      name: 'Organik Patlıcan',
      shortDesc: 'Mor lezzet',
      description: 'Organik yöntemlerle yetiştirilen patlıcanlarımız, lezzetli yemeklerin baş tacı. İmam bayıldı, karnıyarık veya közleme olarak harika.',
      price: 24.90,
      image: 'https://images.pexels.com/photos/7656440/pexels-photo-7656440.jpeg',
      stock: 95,
      sku: 'ORG-PAT-001',
      categoryId: sebzeler.id,
      isOrganic: true,
      isFeatured: false,
      isActive: true,
      origin: 'Adana, Türkiye',
      calories: 25,
      protein: 1,
      carbs: 6,
      fat: 0.2,
      fiber: 3,
      sugar: 3,
      sodium: 2
    },

    // BAKLIYAT
    {
      name: 'Organik Nohut',
      shortDesc: 'Protein deposu bakliyat',
      description: 'Doğal yöntemlerle yetiştirilen organik nohut, protein ve lif kaynağı. Humus, pilav veya çorba yapımında kullanılabilir.',
      price: 45.00,
      image: 'https://images.pexels.com/photos/4198170/pexels-photo-4198170.jpeg',
      stock: 200,
      sku: 'ORG-NOH-001',
      categoryId: bakliyat.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Karaman, Türkiye',
      calories: 364,
      protein: 19,
      carbs: 61,
      fat: 6,
      fiber: 17,
      sugar: 11,
      sodium: 24
    },
    {
      name: 'Organik Kırmızı Mercimek',
      shortDesc: 'Lezzetli ve sağlıklı',
      description: 'Sağlıklı organik mercimek, demir ve protein açısından zengin. 15 dakikada pişen, pratik ve besleyici çorba yapmak için ideal.',
      price: 38.00,
      image: 'https://images.pexels.com/photos/4198390/pexels-photo-4198390.jpeg',
      stock: 180,
      sku: 'ORG-MER-001',
      categoryId: bakliyat.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Şanlıurfa, Türkiye',
      calories: 352,
      protein: 24,
      carbs: 60,
      fat: 1.1,
      fiber: 11,
      sugar: 2,
      sodium: 6
    },
    {
      name: 'Organik Barbunya',
      shortDesc: 'Türk mutfağının vazgeçilmezi',
      description: 'Kuru fasulye çeşidi organik barbunya, klasik Türk yemekleri için ideal. Protein ve lif kaynağı, uzun süre tok tutar.',
      price: 52.00,
      image: 'https://images.pexels.com/photos/5340266/pexels-photo-5340266.jpeg',
      stock: 120,
      sku: 'ORG-BAR-001',
      categoryId: bakliyat.id,
      isOrganic: true,
      isFeatured: false,
      isActive: true,
      origin: 'Kastamonu, Türkiye',
      calories: 333,
      protein: 23,
      carbs: 60,
      fat: 1.2,
      fiber: 15,
      sugar: 2,
      sodium: 12
    },

    // SÜT ÜRÜNLERİ
    {
      name: 'Organik Süt',
      shortDesc: 'Günlük taze süt',
      description: 'Serbest gezen ineklerden günlük sağım taze süt, hiçbir katkı maddesi içermez. Pastörize, homogenize.',
      price: 28.90,
      image: 'https://images.pexels.com/photos/6542652/pexels-photo-6542652.jpeg',
      stock: 80,
      sku: 'ORG-SUT-001',
      categoryId: sutUrunleri.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Bolu, Türkiye',
      calories: 61,
      protein: 3.2,
      carbs: 4.8,
      fat: 3.3,
      fiber: 0,
      sugar: 5,
      sodium: 44
    },
    {
      name: 'Organik Yoğurt',
      shortDesc: 'Probiyotik deposu',
      description: 'Doğal fermantasyon ile üretilen organik yoğurt, probiyotik kaynağı. Sindirim sistemine iyi gelir, bağırsak florası için ideal.',
      price: 42.90,
      image: 'https://images.pexels.com/photos/7758397/pexels-photo-7758397.jpeg',
      stock: 60,
      sku: 'ORG-YOG-001',
      categoryId: sutUrunleri.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Afyon, Türkiye',
      calories: 61,
      protein: 3.5,
      carbs: 4.7,
      fat: 3.3,
      fiber: 0,
      sugar: 4.7,
      sodium: 46
    },
    {
      name: 'Organik Beyaz Peynir',
      shortDesc: 'Klasik Türk kahvaltısı',
      description: 'Salamura organik beyaz peynir, kahvaltıların vazgeçilmezi. Serbest gezen ineklerin sütünden üretilmiş, kalsiyum deposu.',
      price: 95.00,
      image: 'https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg',
      stock: 45,
      sku: 'ORG-PEY-001',
      categoryId: sutUrunleri.id,
      isOrganic: true,
      isFeatured: false,
      isActive: true,
      origin: 'Kars, Türkiye',
      calories: 264,
      protein: 17,
      carbs: 3.9,
      fat: 21,
      fiber: 0,
      sugar: 0.5,
      sodium: 1116
    },

    // ET & TAVUK
    {
      name: 'Organik Tavuk',
      shortDesc: 'Serbest gezinir tavuk',
      description: 'Serbest gezen organik tavuklar, doğal yemlerle beslenir. Hormon ve antibiyotik kullanılmadan yetiştirilen, protein deposu beyaz et.',
      price: 129.90,
      image: 'https://images.pexels.com/photos/3992133/pexels-photo-3992133.jpeg',
      stock: 35,
      sku: 'ORG-TAV-001',
      categoryId: etTavuk.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Bolu, Türkiye',
      calories: 239,
      protein: 27,
      carbs: 0,
      fat: 14,
      fiber: 0,
      sugar: 0,
      sodium: 82
    },
    {
      name: 'Organik Dana Kıyma',
      shortDesc: 'Yağsız sağlıklı kıyma',
      description: 'Organik beslenen danalardan hazırlanan kıyma, protein ve demir açısından zengin. Köfte, sulu yemek ve mantı için ideal.',
      price: 189.90,
      image: 'https://images.pexels.com/photos/3997609/pexels-photo-3997609.jpeg',
      stock: 28,
      sku: 'ORG-KIY-001',
      categoryId: etTavuk.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Ankara, Türkiye',
      calories: 250,
      protein: 26,
      carbs: 0,
      fat: 17,
      fiber: 0,
      sugar: 0,
      sodium: 75
    },

    // BAL & REÇEL
    {
      name: 'Çiçek Balı',
      shortDesc: 'Doğal arı balı',
      description: 'Doğadan arıların topladığı %100 doğal çiçek balı. Hiçbir şeker ilavesi yok. Antioksidan ve antibakteriyel özellikli.',
      price: 195.00,
      image: '/products/honey.jpg',
      stock: 70,
      sku: 'ORG-BAL-001',
      categoryId: balRecel.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Muğla, Türkiye',
      calories: 304,
      protein: 0.3,
      carbs: 82,
      fat: 0,
      fiber: 0.2,
      sugar: 82,
      sodium: 4
    },
    {
      name: 'Organik Vişne Reçeli',
      shortDesc: 'Şeker ilavesiz reçel',
      description: 'Şeker ilavesiz, doğal organik vişnelerden yapılmış reçel. Sadece meyvenin kendi şekeri kullanılmıştır.',
      price: 78.00,
      image: 'https://images.pexels.com/photos/5945756/pexels-photo-5945756.jpeg',
      stock: 55,
      sku: 'ORG-REC-VIS-001',
      categoryId: balRecel.id,
      isOrganic: true,
      isFeatured: false,
      isActive: true,
      origin: 'İzmir, Türkiye',
      calories: 185,
      protein: 0.5,
      carbs: 46,
      fat: 0.2,
      fiber: 1.5,
      sugar: 42,
      sodium: 8
    },
    {
      name: 'Organik Çilek Reçeli',
      shortDesc: 'El yapımı çilek reçeli',
      description: 'Taze organik çileklerden geleneksel yöntemlerle hazırlanmış reçel. Çay saatlerinin ve kahvaltıların lezzetli tamamlayıcısı.',
      price: 82.00,
      image: 'https://images.pexels.com/photos/14940242/pexels-photo-14940242.jpeg',
      stock: 48,
      sku: 'ORG-REC-CIL-001',
      categoryId: balRecel.id,
      isOrganic: true,
      isFeatured: true,
      isActive: true,
      origin: 'Bursa, Türkiye',
      calories: 196,
      protein: 0.4,
      carbs: 49,
      fat: 0.2,
      fiber: 1.2,
      sugar: 45,
      sodium: 6
    }
  ]

  for (const productData of products) {
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: productData,
      create: productData
    })
  }

  console.log('✅ Products created')
  console.log(`🎉 Seed completed! Created ${products.length} products across 6 categories`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
