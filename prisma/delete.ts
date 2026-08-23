import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { getDatabaseUrl } from '../src/server/db/database-url.js'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Deleting database...')

  const platforms = await prisma.platform.deleteMany()
  const identifiers = await prisma.identifier.deleteMany()
  const urls = await prisma.url.deleteMany()

  console.log(`✅ Deleted ${platforms.count} platforms`)
  console.log(`✅ Deleted ${identifiers.count} identifiers`)
  console.log(`✅ Deleted ${urls.count} urls`)
}

main()
  .catch((e) => {
    console.error('❌ Error deleting database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
