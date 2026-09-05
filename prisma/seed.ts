import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { getDatabaseUrl } from '../src/server/db/database-url.js'

import { IdentifierService } from '@/server/features/identifier/identifier.service.js'
import { PlatformService } from '@/server/features/platform/platform.service.js'
import { UrlService } from '@/server/features/url/url.service.js'

import {
  generateIdentifiers,
  generatePlatforms,
  generateUrls,
} from './faker/index.js'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const userId = '64bf6ae9-1651-41f9-9986-4c70e04f92f5'
  console.log('🌱 Seeding database...')

  // await prisma.url.deleteMany({ where: { userId } })
  // await prisma.platform.deleteMany({ where: { userId } })
  // await prisma.identifier.deleteMany({ where: { userId } })

  const platforms = await PlatformService.createMany(
    prisma,
    userId,
    generatePlatforms(150),
  )

  const identifiers = await IdentifierService.createMany(
    prisma,
    userId,
    generateIdentifiers(150),
  )

  console.log(`✅ Created ${platforms.count} platforms`)
  console.log(`✅ Created ${identifiers.count} identifiers`)

  const platformIds = platforms.data.map((p) => p.id)
  const identifierIds = identifiers.data.map((i) => i.id)

  const urls = await UrlService.createMany(
    prisma,
    userId,
    generateUrls(1500, platformIds, identifierIds),
  )

  console.log(`✅ Created ${urls.count} urls`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
