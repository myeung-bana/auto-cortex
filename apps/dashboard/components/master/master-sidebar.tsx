"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, LayoutDashboard, LogOut, ShieldCheck } from "lucide-react"
import { Button, cn } from "@autocore/ui"
import { ROUTES } from "@/lib/constants/routes"
import { signOutMaster } from "@/lib/actions/auth"

const MASTER_NAV = [
  { href: ROUTES.masterConsole, label: "Overview", icon: LayoutDashboard },
  { href: ROUTES.masterSpaces, label: "Business Spaces", icon: Building2 },
]

export function MasterSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname()

  return (
    <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border flex w-64 shrink-0 flex-col border-r">
      <div className="border-sidebar-border border-b p-6">
        <div className="flex items-center gap-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">Master Console</p>
            <p className="text-muted-foreground text-xs">AutoCore platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {MASTER_NAV.map((item) => {
          const isActive =
            item.href === ROUTES.masterConsole
              ? pathname === item.href
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-sidebar-border space-y-3 border-t p-4">
        <p className="text-sm font-medium">{adminName}</p>
        <form action={signOutMaster}>
          <Button type="submit" variant="outline" size="sm" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </aside>
  )
}
