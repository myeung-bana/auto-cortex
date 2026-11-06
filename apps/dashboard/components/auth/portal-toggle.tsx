import Link from "next/link"
import { Car, ShieldCheck } from "lucide-react"
import { cn } from "@autocore/ui"
import type { AuthPortal } from "@/lib/auth/portal"
import { ROUTES } from "@/lib/constants/routes"

const PORTALS = [
  { portal: "workspace", label: "Business Space", href: ROUTES.login, icon: Car },
  { portal: "master", label: "Platform Admin", href: ROUTES.masterLogin, icon: ShieldCheck },
] as const

/** Switches between the two login URLs; the Auth role still decides who gets in. */
export function PortalToggle({ portal }: { portal: AuthPortal }) {
  return (
    <nav aria-label="Sign-in type" className="bg-muted grid grid-cols-2 gap-1 rounded-lg p-1">
      {PORTALS.map((item) => {
        const active = item.portal === portal
        const Icon = item.icon
        return (
          <Link
            key={item.portal}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
