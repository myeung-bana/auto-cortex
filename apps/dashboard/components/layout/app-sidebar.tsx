"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Car,
  LayoutDashboard,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@autocore/ui"
import { NAV_ITEMS } from "@/lib/constants/routes"
import type { BusinessSpace, User } from "@autocore/utils"
import { BUSINESS_NATURE_LABELS } from "@autocore/utils"
import { UserMenu } from "./user-menu"

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Car,
  Settings,
}

interface AppSidebarProps {
  user: User
  businessSpace: BusinessSpace
}

export function AppSidebar({ user, businessSpace }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="bg-sidebar text-sidebar-foreground border-sidebar-border flex w-64 shrink-0 flex-col border-r">
      <div className="border-sidebar-border border-b p-6">
        <div className="flex items-center gap-2">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
            <Car className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold">AutoCore</p>
            <p className="text-muted-foreground text-xs">
              {businessSpace.name}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {BUSINESS_NATURE_LABELS[businessSpace.nature]}
        </p>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon]
          const isActive =
            item.href === "/"
              ? pathname === "/"
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
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-sidebar-border border-t p-4">
        <UserMenu user={user} businessSpace={businessSpace} />
      </div>
    </aside>
  )
}
