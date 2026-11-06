"use client"

import { useState } from "react"
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@autocore/ui"
import { toast } from "sonner"
import { saveListingDetailsAction } from "@/lib/actions/listings"
import type { ListingOption } from "@/lib/taxonomies/types"

interface DetailsValues {
  year: number
  mileage: number | null
  transmission: string
  make: string
  bodyType: string
  fuelType: string
  engineCc: number | null
  exteriorColor: string
  interiorColor: string
  seats: number | null
  doors: number | null
}

export function DetailsForm({
  listingId,
  values,
  makes,
  bodyTypes,
  transmissions,
  fuelTypes,
  exteriorColors,
  interiorColors,
}: {
  listingId: string
  values: DetailsValues
  makes: ListingOption[]
  bodyTypes: ListingOption[]
  transmissions: ListingOption[]
  fuelTypes: ListingOption[]
  exteriorColors: ListingOption[]
  interiorColors: ListingOption[]
}) {
  const [form, setForm] = useState(values)
  const [pending, setPending] = useState(false)

  function set<K extends keyof DetailsValues>(key: K, value: DetailsValues[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function save(event: React.FormEvent) {
    event.preventDefault()
    if (!form.make) {
      toast.error("Make is required")
      return
    }
    setPending(true)
    try {
      await saveListingDetailsAction(listingId, {
        year: Number(form.year),
        mileage: form.mileage,
        transmission: form.transmission || null,
        make: form.make,
        bodyType: form.bodyType || null,
        fuelType: form.fuelType || null,
        engineCc: form.engineCc,
        exteriorColor: form.exteriorColor || null,
        interiorColor: form.interiorColor || null,
        seats: form.seats,
        doors: form.doors,
      })
      toast.success("Listing details saved")
    } catch {
      toast.error("Failed to save listing details")
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          id="year"
          label="Year"
          value={form.year}
          onChange={(value) => set("year", value ?? new Date().getFullYear())}
        />
        <NumberField
          id="mileage"
          label="Mileage (km)"
          value={form.mileage}
          onChange={(value) => set("mileage", value)}
        />
        <OptionField
          label="Transmission"
          value={form.transmission}
          options={transmissions}
          onChange={(value) => set("transmission", value)}
        />
        <OptionField
          label="Make"
          value={form.make}
          options={makes}
          onChange={(value) => set("make", value)}
        />
        <OptionField
          label="Body type"
          value={form.bodyType}
          options={bodyTypes}
          onChange={(value) => set("bodyType", value)}
        />
        <OptionField
          label="Fuel type"
          value={form.fuelType}
          options={fuelTypes}
          onChange={(value) => set("fuelType", value)}
        />
        <NumberField
          id="engineCc"
          label="Engine size (cc)"
          value={form.engineCc}
          onChange={(value) => set("engineCc", value)}
        />
        <OptionField
          label="Exterior colour"
          value={form.exteriorColor}
          options={exteriorColors}
          onChange={(value) => set("exteriorColor", value)}
        />
        <OptionField
          label="Interior colour"
          value={form.interiorColor}
          options={interiorColors}
          onChange={(value) => set("interiorColor", value)}
        />
        <NumberField
          id="seats"
          label="Number of seats"
          value={form.seats}
          onChange={(value) => set("seats", value)}
        />
        <NumberField
          id="doors"
          label="Number of doors"
          value={form.doors}
          onChange={(value) => set("doors", value)}
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save details"}
      </Button>
    </form>
  )
}

function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: number | null
  onChange: (value: number | null) => void
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value ?? ""}
        onChange={(event) =>
          onChange(event.target.value === "" ? null : Number(event.target.value))
        }
      />
    </div>
  )
}

function OptionField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: ListingOption[]
  onChange: (value: string) => void
}) {
  const items =
    value && !options.some((option) => option.slug === value)
      ? [{ slug: value, label: value }, ...options]
      : options

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value || "none"} onValueChange={(next) => onChange(next === "none" ? "" : next)}>
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {items.map((option) => (
            <SelectItem key={option.slug} value={option.slug}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
