import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { getDatabaseUrl } from '../src/server/db/database-url.js'

import { IdentifierService } from '@/server/features/identifier/identifier.service.js'
import { PlatformService } from '@/server/features/platform/platform.service.js'

import { generateIdentifiers, generatePlatforms } from './faker/index.js'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const userId = '2ca04dcb-95b3-43d1-aa8a-51b6bfefed63'
  console.log('🌱 Seeding database...')

  // await prisma.url.deleteMany({ where: { userId } })
  // await prisma.platform.deleteMany({ where: { userId } })
  // await prisma.identifier.deleteMany({ where: { userId } })

  const platforms = await PlatformService.createMany(
    prisma,
    userId,
    generatePlatforms(100),
  )

  const identifiers = await IdentifierService.createMany(
    prisma,
    userId,
    generateIdentifiers(100),
  )

  console.log(`✅ Created ${platforms.count} platforms`)
  console.log(`✅ Created ${identifiers.count} identifiers`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
