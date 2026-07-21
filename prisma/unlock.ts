import "dotenv/config"
import { PrismaClient } from "@/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const url = process.env.DATABASE_URL!
const { PrismaNeon } = require("@prisma/adapter-neon")
const { neon } = require("@neondatabase/serverless")

async function main() {
  const client = neon(url)
  const adapter = new PrismaNeon(client)
  const prisma = new PrismaClient({ adapter })

  await prisma.$executeRawUnsafe(
    `UPDATE "_prisma_migrations" SET "logs" = NULL, "rolled_back_at" = NULL WHERE "migration_name" LIKE '%'`
  )

  console.log("→ Migraciones desbloqueadas")
  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
