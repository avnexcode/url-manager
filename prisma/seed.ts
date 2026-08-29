import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { getDatabaseUrl } from '../src/server/db/database-url.js'

import { IdentifierService } from '@/server/features/identifier/identifier.service.js'
import { PlatformService } from '@/server/features/platform/platform.service.js'
import { UrlService } from '@/server/features/url/url.service.js'

import { bulkCreateIdentifiersRequest } from '@/server/features/identifier/identifier.validation.js'
import { bulkCreatePlatformsRequest } from '@/server/features/platform/platform.validation.js'
import { bulkCreateUrlsRequest } from '@/server/features/url/url.validation.js'

import identifiersData from './data/identifier.json'
import platformsData from './data/platform.json'
import urlsData from './data/url.json'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function main() {
  const userId = '92512802-f85a-491c-a2c8-c000e837cc8f'
  console.log('🌱 Seeding database...')

  await prisma.url.deleteMany({ where: { userId } })
  await prisma.platform.deleteMany({ where: { userId } })
  await prisma.identifier.deleteMany({ where: { userId } })

  const parsedPlatforms = bulkCreatePlatformsRequest.parse(platformsData)

  const platforms = await PlatformService.createMany(
    prisma,
    userId,
    parsedPlatforms,
  )

  const parsedIdentifiers = bulkCreateIdentifiersRequest.parse(identifiersData)

  const identifiers = await IdentifierService.createMany(
    prisma,
    userId,
    parsedIdentifiers,
  )

  // const parsedUrls = bulkCreateUrlsRequest.parse(urlsData)

  // const urls = await UrlService.createMany(
  //   prisma,
  //   userId,
  //   parsedUrls,
  // )

  console.log(`✅ Created ${platforms.count} platforms`)
  console.log(`✅ Created ${identifiers.count} identifiers`)
  // console.log(`✅ Created ${urls.count} urls`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
