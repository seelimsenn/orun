import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.error('Lütfen bir e-posta adresi girin: npx tsx scripts/make-admin.ts ornek@email.com')
    process.exit(1)
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    console.log(`✅ Başarılı! ${user.email} artık bir ADMIN.`)
  } catch (error) {
    console.error('❌ Hata: Kullanıcı bulunamadı veya bir sorun oluştu.')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
