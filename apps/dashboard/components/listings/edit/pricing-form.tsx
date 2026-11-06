"use client"

import { useState } from "react"
import { Button, Input, Label } from "@autocore/ui"
import { toast } from "sonner"
import { saveListingPricingAction } from "@/lib/actions/listings"

export function PricingForm({
  listingId,
  amount,
  currency,
}: {
  listingId: string
  amount: number | null
  currency: string
}) {
  const [price, setPrice] = useState(amount?.toString() ?? "")
  const [code, setCode] = useState(currency)
  const [pending, setPending] = useState(false)

  async function save(event: React.FormEvent) {
    event.preventDefault()
    const parsed = Number(price)
    if (!price || Number.isNaN(parsed) || parsed < 0) {
      toast.error("Enter a valid price")
      return
    }
    setPending(true)
    try {
      await saveListingPricingAction(listingId, {
        amount: parsed,
        currency: code.trim() || "HKD",
      })
      toast.success("Pricing saved")
    } catch {
      toast.error("Failed to save pricing")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={save} className="max-w-md space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Asking price</Label>
        <Input
          id="amount"
          type="number"
          min={0}
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Input
          id="currency"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save pricing"}
      </Button>
    </form>
  )
}
