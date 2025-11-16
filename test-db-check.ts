import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    take: 5,
    include: { category: true }
  })
  
  console.log('📦 Veritabanında', products.length, 'ürün bulundu (ilk 5):')
  products.forEach(p => {
    console.log(`  - ${p.name} (${p.price}₺) - Kategori: ${p.category.name} - Stok: ${p.stock}`)
  })
  
  const total = await prisma.product.count()
  const categories = await prisma.category.count()
  console.log('\n✅ Toplam ürün:', total)
  console.log('✅ Toplam kategori:', categories)
}

main()
  .catch(e => console.error('❌ Hata:', e.message))
  .finally(() => prisma.$disconnect())
