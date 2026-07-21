import { PrismaClient } from "@/generated/prisma"

function createPrismaClient() {
  const url = process.env.DATABASE_URL!

  if (process.env.VERCEL || url.includes("neon.tech")) {
    const { PrismaNeon } = require("@prisma/adapter-neon")
    const { neon } = require("@neondatabase/serverless")
    const client = neon(url)
    const adapter = new PrismaNeon(client)
    return new PrismaClient({ adapter })
  }

  const { PrismaPg } = require("@prisma/adapter-pg")
  const adapter = new PrismaPg(url)
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export { PrismaClient }
