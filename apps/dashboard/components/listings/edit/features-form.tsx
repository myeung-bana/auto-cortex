"use client"

import { useState } from "react"
import { Button } from "@autocore/ui"
import { toast } from "sonner"
import { saveListingFeaturesAction } from "@/lib/actions/listings"
import type { ListingOption } from "@/lib/taxonomies/types"

const GROUPS = ["safety", "comfort", "technology", "exterior"] as const

export function FeaturesForm({
  listingId,
  selected,
  features,
}: {
  listingId: string
  selected: string[]
  features: ListingOption[]
}) {
  const [chosen, setChosen] = useState(selected)
  const [pending, setPending] = useState(false)

  function toggle(slug: string) {
    setChosen((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    )
  }

  async function save() {
    setPending(true)
    try {
      await saveListingFeaturesAction(listingId, chosen)
      toast.success("Features saved")
    } catch {
      toast.error("Failed to save features")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-6">
      {GROUPS.map((group) => {
        const items = features.filter((feature) => feature.category === group)
        if (items.length === 0) return null
        return (
          <div key={group}>
            <p className="mb-2 text-sm font-medium capitalize">{group}</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {items.map((feature) => (
                <label key={feature.slug} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={chosen.includes(feature.slug)}
                    onChange={() => toggle(feature.slug)}
                  />
                  {feature.label}
                </label>
              ))}
            </div>
          </div>
        )
      })}
      <Button type="button" onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save features"}
      </Button>
    </div>
  )
}
