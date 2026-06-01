"use client"

import { useRouter } from "next/navigation"
import { Input } from "@autocore/ui"
import { Search } from "lucide-react"
import { useCallback, useState } from "react"
import { ROUTES } from "@/lib/constants/routes"

interface ClientSearchProps {
  defaultValue?: string
}

export function ClientSearch({ defaultValue = "" }: ClientSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState(defaultValue)

  const handleSearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams()
      if (value.trim()) params.set("q", value.trim())
      router.push(`${ROUTES.clients}?${params.toString()}`)
    },
    [router]
  )

  return (
    <div className="relative max-w-sm">
      <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
      <Input
        placeholder="Search clients..."
        className="pl-9"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch(query)
        }}
        onBlur={() => {
          if (query !== defaultValue) handleSearch(query)
        }}
      />
    </div>
  )
}
