"use client"

import { useRouter } from "next/navigation"
import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@autocore/ui"
import { Search } from "lucide-react"
import { useCallback, useState } from "react"
import { ROUTES } from "@/lib/constants/routes"
import type { BusinessNature, ListingStatus } from "@autocore/utils"
import { LISTING_STATUS_LABELS } from "@autocore/utils"

interface ListingSearchProps {
  defaultQuery?: string
  defaultStatus?: string
  view?: "list" | "grid"
  nature: BusinessNature
}

export function ListingSearch({
  defaultQuery = "",
  defaultStatus = "",
  view = "list",
  nature,
}: ListingSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultQuery)
  const [status, setStatus] = useState(defaultStatus)

  const relevantStatuses: ListingStatus[] =
    nature === "SECOND_HAND_DEALER"
      ? ["AVAILABLE", "RESERVED", "SOLD"]
      : ["AVAILABLE", "RENTED"]

  const applyFilters = useCallback(
    (q: string, s: string) => {
      const params = new URLSearchParams()
      if (q.trim()) params.set("q", q.trim())
      if (s) params.set("status", s)
      if (view === "grid") params.set("view", "grid")
      const search = params.toString()
      router.push(search ? `${ROUTES.listings}?${search}` : ROUTES.listings)
    },
    [router, view]
  )

  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative max-w-sm flex-1">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          placeholder="Search listings..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") applyFilters(query, status)
          }}
          onBlur={() => {
            if (query !== defaultQuery) applyFilters(query, status)
          }}
        />
      </div>
      <Select
        value={status || "all"}
        onValueChange={(v) => {
          const newStatus = v === "all" ? "" : v
          setStatus(newStatus)
          applyFilters(query, newStatus)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {relevantStatuses.map((s) => (
            <SelectItem key={s} value={s}>
              {LISTING_STATUS_LABELS[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
