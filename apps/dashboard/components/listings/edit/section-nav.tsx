"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@autocore/ui"
import { ROUTES } from "@/lib/constants/routes"

const SECTIONS = [
  { key: "gallery", label: "Gallery" },
  { key: "pricing", label: "Pricing" },
  { key: "details", label: "Listing details" },
  { key: "features", label: "Features" },
] as const

export function ListingEditNav({ listingId }: { listingId: string }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap gap-2">
      {SECTIONS.map((section) => {
        const href = ROUTES.listingEditSection(listingId, section.key)
        const isActive = pathname === href
        return (
          <Link
            key={section.key}
            href={href}
            className={cn(
              "rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground hover:bg-accent"
            )}
          >
            {section.label}
          </Link>
        )
      })}
    </nav>
  )
}
