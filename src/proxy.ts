import NextAuth from "next-auth"
import authConfig from "@/lib/auth.config"

const { auth: authFn } = NextAuth(authConfig)

export const proxy = authFn

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png).*)"],
}
