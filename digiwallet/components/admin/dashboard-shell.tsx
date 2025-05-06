import type React from "react"
import { DashboardNav } from "@/components/admin/dashboard-nav"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
      <DashboardNav />
      <main className="flex flex-col p-6 md:gap-8 md:p-8">
        <div className="flex-1">{children}</div>
      </main>
    </div>
  )
}

