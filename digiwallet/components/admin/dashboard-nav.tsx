"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
  
  ]

  return (
    <div className="flex h-full flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Wallet className="h-6 w-6" />
          <span>Admin Portal</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item, index) => (
            <Button key={index} asChild variant={item.active ? "secondary" : "ghost"} className="justify-start gap-2">
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}

