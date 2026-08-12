import type { Prisma } from '@/generated/prisma/client.js'
import { PrismaClient } from '@/generated/prisma/client.js'
import { getDatabaseUrl } from '@/server/db/database-url.js'
import { PrismaPg } from '@prisma/adapter-pg'

export type DBClient = PrismaClient | Prisma.TransactionClient

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

declare global {
  var __prisma: PrismaClient | undefined
}

export const prisma = globalThis.__prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
