import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const meyveler = await prisma.category.create({
    data: {
      name: 'Meyveler',
      slug: 'meyveler',
      description: 'Taze organik meyveler'
    }
  })

  const sebzeler = await prisma.category.create({
    data: {
      name: 'Sebzeler',
      slug: 'sebzeler',
      description: 'Doğal organik sebzeler'
    }
  })

  const bakliyat = await prisma.category.create({
    data: {
      name: 'Bakliyat',
      slug: 'bakliyat',
      description: 'Sağlıklı bakliyat ürünleri'
    }
  })

  const sutUrunleri = await prisma.category.create({
    data: {
      name: 'Süt Ürünleri',
      slug: 'sut-urunleri',
      description: 'Taze süt ve süt ürünleri'
    }
  })

  const etTavuk = await prisma.category.create({
    data: {
      name: 'Et & Tavuk',
      slug: 'et-tavuk',
      description: 'Organik et ve tavuk ürünleri'
    }
  })

  const balRecel = await prisma.category.create({
    data: {
      name: 'Bal & Reçel',
      slug: 'bal-recel',
      description: 'Doğal bal ve reçeller'
    }
  })

  // Create products
  await prisma.product.createMany({
    data: [
      {
        name: 'Organik Elma 1kg',
        description: 'Türkiye\'nin en verimli topraklarında yetiştirilen organik elmalarımız, hiçbir kimyasal gübre veya pestisit kullanılmadan üretilmektedir.',
        price: 32.50,
        image: '/images/elma.jpg',
        stock: 50,
        sku: 'ORG-ELMA-001',
        categoryId: meyveler.id,
        isOrganic: true,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Organik Portakal 1kg',
        description: 'Güneşin ve doğanın gücüyle yetiştirilen organik portakallar, C vitamini deposu.',
        price: 28.90,
        image: '/images/portakal.jpg',
        stock: 45,
        sku: 'ORG-PORT-001',
        categoryId: meyveler.id,
        isOrganic: true,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Doğal Domates 1kg',
        description: 'Serada yetiştirilen doğal domatesler, hiçbir hormon kullanılmadan.',
        price: 18.90,
        image: '/images/domates.jpg',
        stock: 60,
        sku: 'ORG-DOM-001',
        categoryId: sebzeler.id,
        isOrganic: true,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Organik Salatalık 1kg',
        description: 'Taze ve gevrek organik salatalıklar, sağlıklı beslenmenin vazgeçilmezi.',
        price: 15.90,
        image: '/images/salatalik.jpg',
        stock: 40,
        sku: 'ORG-SAL-001',
        categoryId: sebzeler.id,
        isOrganic: true,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Organik Nohut 500gr',
        description: 'Doğal yöntemlerle yetiştirilen organik nohut, protein ve lif kaynağı.',
        price: 28.50,
        image: '/images/nohut.jpg',
        stock: 80,
        sku: 'ORG-NOH-001',
        categoryId: bakliyat.id,
        isOrganic: true,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Organik Mercimek 500gr',
        description: 'Sağlıklı organik mercimek, demir ve protein açısından zengin.',
        price: 25.90,
        image: '/images/mercimek.jpg',
        stock: 75,
        sku: 'ORG-MER-001',
        categoryId: bakliyat.id,
        isOrganic: true,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Taze Süt 1L',
        description: 'Günlük sağım taze süt, hiçbir katkı maddesi içermez.',
        price: 22.90,
        image: '/images/sut.jpg',
        stock: 30,
        sku: 'ORG-SUT-001',
        categoryId: sutUrunleri.id,
        isOrganic: true,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Organik Yoğurt 1kg',
        description: 'Doğal fermantasyon ile üretilen organik yoğurt, probiyotik kaynağı.',
        price: 35.90,
        image: '/images/yogurt.jpg',
        stock: 25,
        sku: 'ORG-YOG-001',
        categoryId: sutUrunleri.id,
        isOrganic: true,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Organik Tavuk 1kg',
        description: 'Serbest gezen organik tavuklar, doğal yemlerle beslenir.',
        price: 89.90,
        image: '/images/tavuk.jpg',
        stock: 20,
        sku: 'ORG-TAV-001',
        categoryId: etTavuk.id,
        isOrganic: true,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Çiçek Balı 500gr',
        description: 'Doğadan arıların topladığı %100 doğal çiçek balı.',
        price: 95.00,
        image: '/images/bal.jpg',
        stock: 35,
        sku: 'ORG-BAL-001',
        categoryId: balRecel.id,
        isOrganic: true,
        isFeatured: true,
        isActive: true
      },
      {
        name: 'Organik Vişne Reçeli 350gr',
        description: 'Şeker ilavesiz, doğal organik vişnelerden yapılmış reçel.',
        price: 65.00,
        image: '/images/recel.jpg',
        stock: 28,
        sku: 'ORG-REC-001',
        categoryId: balRecel.id,
        isOrganic: true,
        isFeatured: false,
        isActive: true
      },
      {
        name: 'Organik Muz 1kg',
        description: 'Tropik iklimde yetiştirilen organik muzlar, potasyum kaynağı.',
        price: 42.90,
        image: '/images/muz.jpg',
        stock: 38,
        sku: 'ORG-MUZ-001',
        categoryId: meyveler.id,
        isOrganic: true,
        isFeatured: false,
        isActive: true
      }
    ]
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })