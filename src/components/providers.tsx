"use client"

import { SessionProvider } from "next-auth/react"
import { Sidebar } from "@/components/sidebar"
import { usePathname } from "next/navigation"

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === "/login"

  if (isLogin) {
    return <>{children}</>
  }

  return (
    <SessionProvider>
      <Sidebar />
      <main className="ml-64 min-h-screen p-6">{children}</main>
    </SessionProvider>
  )
}
