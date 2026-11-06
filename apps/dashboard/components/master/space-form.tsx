"use client"

import { useState } from "react"
import { Button, Input, Label } from "@autocore/ui"
import { BUSINESS_NATURE_LABELS, type BusinessNature } from "@autocore/utils"
import { toast } from "sonner"
import type { ActionResult } from "@/lib/master/types"

export interface SpaceFormValues {
  name: string
  nature: BusinessNature
  seatLimit: number
  ownerName: string
  ownerEmail: string
}

interface SpaceFormProps {
  mode: "create" | "edit"
  defaultValues?: Partial<SpaceFormValues>
  onSubmit: (values: SpaceFormValues) => Promise<ActionResult>
}

function isRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  )
}

export function SpaceForm({ mode, defaultValues, onSubmit }: SpaceFormProps) {
  const [values, setValues] = useState<SpaceFormValues>({
    name: "",
    nature: "SECOND_HAND_DEALER",
    seatLimit: 5,
    ownerName: "",
    ownerEmail: "",
    ...defaultValues,
  })
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof SpaceFormValues>(key: K, value: SpaceFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    try {
      const result = await onSubmit({
        ...values,
        seatLimit: Number(values.seatLimit),
      })
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
        setPending(false)
      }
    } catch (err) {
      if (isRedirect(err)) {
        toast.success(mode === "create" ? "Business Space created" : "Business Space saved")
        throw err
      }
      setError("Failed to save Business Space")
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Space name *</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(event) => set("name", event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nature">Business nature</Label>
          <select
            id="nature"
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
            value={values.nature}
            onChange={(event) => set("nature", event.target.value as BusinessNature)}
          >
            {Object.entries(BUSINESS_NATURE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="seatLimit">Seat limit *</Label>
          <Input
            id="seatLimit"
            type="number"
            min={1}
            value={values.seatLimit}
            onChange={(event) => set("seatLimit", Number(event.target.value))}
          />
        </div>
      </div>

      {mode === "create" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner name *</Label>
            <Input
              id="ownerName"
              value={values.ownerName}
              onChange={(event) => set("ownerName", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Owner email *</Label>
            <Input
              id="ownerEmail"
              type="email"
              value={values.ownerEmail}
              onChange={(event) => set("ownerEmail", event.target.value)}
            />
          </div>
        </div>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : mode === "create" ? "Create Business Space" : "Save changes"}
      </Button>
    </form>
  )
}
