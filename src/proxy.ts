import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"

console.log("[PROXY] initializing with providers:", (authConfig as any).providers?.length ?? 0)

const { auth: authFn } = NextAuth(authConfig)

export const proxy = authFn

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
}
