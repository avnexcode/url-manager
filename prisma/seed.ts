import { PrismaPg } from '@prisma/adapter-pg'
import type { Prisma } from '../src/generated/prisma/client.js'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { getDatabaseUrl } from '../src/server/db/database-url.js'

import platformsData from './data/platform.json'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  await prisma.platform.deleteMany()

  const platforms = await prisma.platform.createMany({
    data: platformsData as Prisma.PlatformCreateManyInput[],
  })

  console.log(`✅ Created ${platforms.count} platforms`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
