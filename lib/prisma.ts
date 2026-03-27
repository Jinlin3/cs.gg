import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = `${process.env.POSTGRES_PRISMA_URL ?? process.env.DATABASE_URL}`

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

if (!globalForPrisma.prisma) {
  const adapter = new PrismaPg({ connectionString })
  globalForPrisma.prisma = new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma