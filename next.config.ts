import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "@prisma/adapter-neon", "@neondatabase/serverless"],
}

export default nextConfig
