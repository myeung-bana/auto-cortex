"use client"

import { useRouter } from "next/navigation"
import { Button } from "@autocore/ui"
import { LayoutGrid, List } from "lucide-react"
import { cn } from "@autocore/ui"
import { ROUTES } from "@/lib/constants/routes"

export function ListingViewToggle({
  view,
  query,
  status,
}: {
  view: "list" | "grid"
  query?: string
  status?: string
}) {
  const router = useRouter()

  function setView(next: "list" | "grid") {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (status) params.set("status", status)
    if (next === "grid") params.set("view", "grid")
    const search = params.toString()
    router.push(search ? `${ROUTES.listings}?${search}` : ROUTES.listings)
  }

  return (
    <div className="bg-card flex rounded-md border p-1">
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label="List view"
        className={cn(view === "list" && "bg-accent")}
        onClick={() => setView("list")}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label="Grid view"
        className={cn(view === "grid" && "bg-accent")}
        onClick={() => setView("grid")}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  )
}
