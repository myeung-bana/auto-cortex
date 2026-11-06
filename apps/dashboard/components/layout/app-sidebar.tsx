"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Car,
  ChevronDown,
  LayoutDashboard,
  Settings,
  Tags,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@autocore/ui"
import { NAV_ITEMS, ROUTES } from "@/lib/constants/routes"
import { TAXONOMY_CONFIGS } from "@/lib/taxonomies/registry"
import type { BusinessSpace, User } from "@autocore/utils"
import { BUSINESS_NATURE_LABELS } from "@autocore/utils"
import { UserMenu } from "./user-menu"

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Car,
  UserCog,
  Settings,
}

interface AppSidebarProps {
  user: User
  businessSpace: BusinessSpace
}

export function AppSidebar({ user, businessSpace }: AppSidebarProps) {
  const pathname = usePathname()
  const taxonomyActive = pathname.startsWith("/taxonomies")
  const [taxonomiesOpen, setTaxonomiesOpen] = useState(taxonomyActive)
  const primaryNav = NAV_ITEMS.filter((item) => {
    if (item.href === ROUTES.settings) return false
    if (
      item.href === ROUTES.userManagement &&
      user.role !== "BUSINESS_OWNER"
    ) {
      return false
    }
    return true
  })
  const settingsNav = NAV_ITEMS.find((item) => item.href === "/settings")

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

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {primaryNav.map((item) => {
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

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setTaxonomiesOpen((open) => !open)}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              taxonomyActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Tags className="h-4 w-4" />
            Taxonomies
            <ChevronDown
              className={cn(
                "ml-auto h-4 w-4 transition-transform",
                taxonomiesOpen && "rotate-180"
              )}
            />
          </button>
          {taxonomiesOpen && (
            <div className="mt-1 space-y-1 pl-4">
              {TAXONOMY_CONFIGS.map((item) => {
                const href = `/taxonomies/${item.key}`
                const isActive = pathname === href || pathname.startsWith(`${href}/`)
                return (
                  <Link
                    key={item.key}
                    href={href}
                    className={cn(
                      "block rounded-md px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {settingsNav && (
          <Link
            href={settingsNav.href}
            className={cn(
              "mt-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith(settingsNav.href)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            {settingsNav.label}
          </Link>
        )}
      </nav>

      <div className="border-sidebar-border border-t p-4">
        <UserMenu user={user} businessSpace={businessSpace} />
      </div>
    </aside>
  )
}
