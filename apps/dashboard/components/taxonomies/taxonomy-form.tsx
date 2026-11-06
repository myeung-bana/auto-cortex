"use client"

import { useState } from "react"
import { Button, Input, Label } from "@autocore/ui"
import { toast } from "sonner"
import type { TaxonomyConfig, TaxonomyField, TaxonomyInput } from "@/lib/taxonomies/types"

const FEATURE_CATEGORIES = ["safety", "comfort", "technology", "exterior"]

interface TaxonomyFormProps {
  config: TaxonomyConfig
  defaultValues?: Partial<TaxonomyInput>
  onSubmit: (values: TaxonomyInput) => Promise<{ error?: string } | void>
  submitLabel: string
}

function isRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  )
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function TaxonomyForm({
  config,
  defaultValues,
  onSubmit,
  submitLabel,
}: TaxonomyFormProps) {
  const [values, setValues] = useState<TaxonomyInput>({
    nameEn: "",
    nameZh: "",
    slug: "",
    sortOrder: 0,
    isActive: true,
    ...defaultValues,
  })
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function has(field: TaxonomyField) {
    return config.fields.includes(field)
  }

  function set<K extends keyof TaxonomyInput>(key: K, value: TaxonomyInput[K]) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!values.nameEn.trim()) {
      setError("English name is required")
      return
    }
    setPending(true)
    setError(null)
    try {
      const result = await onSubmit({
        ...values,
        slug: slugify(values.slug || values.nameEn),
        sortOrder: Number(values.sortOrder) || 0,
      })
      if (result?.error) {
        setError(result.error)
        toast.error(result.error)
        setPending(false)
        return
      }
      toast.success("Taxonomy saved")
    } catch (err) {
      if (isRedirect(err)) throw err
      const message = err instanceof Error ? err.message : "Failed to save"
      setError(message)
      toast.error(message)
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nameEn">
            {config.kind === "range" ? "Label" : "Name (English)"} *
          </Label>
          <Input
            id="nameEn"
            value={values.nameEn}
            onChange={(event) => {
              const nameEn = event.target.value
              setValues((current) => ({
                ...current,
                nameEn,
                slug: current.slug ? current.slug : slugify(nameEn),
              }))
            }}
          />
        </div>
        {has("nameZh") && (
          <div className="space-y-2">
            <Label htmlFor="nameZh">Name (Traditional Chinese)</Label>
            <Input
              id="nameZh"
              value={values.nameZh ?? ""}
              onChange={(event) => set("nameZh", event.target.value)}
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={values.slug}
            onChange={(event) => set("slug", slugify(event.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={values.sortOrder}
            onChange={(event) => set("sortOrder", Number(event.target.value))}
          />
        </div>
      </div>

      {has("country") && (
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={values.country ?? ""}
            onChange={(event) => set("country", event.target.value)}
          />
        </div>
      )}

      {has("logoUrl") && (
        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            value={values.logoUrl ?? ""}
            onChange={(event) => set("logoUrl", event.target.value)}
          />
        </div>
      )}

      {has("hex") && (
        <div className="space-y-2">
          <Label htmlFor="hex">Hex colour</Label>
          <div className="flex items-center gap-3">
            <Input
              id="hex"
              value={values.hex ?? ""}
              onChange={(event) => set("hex", event.target.value)}
              placeholder="#111111"
            />
            <span
              className="h-10 w-10 rounded-md border"
              style={{ backgroundColor: values.hex || "transparent" }}
            />
          </div>
        </div>
      )}

      {has("icon") && (
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Input
            id="icon"
            value={values.icon ?? ""}
            onChange={(event) => set("icon", event.target.value)}
          />
        </div>
      )}

      {has("category") && (
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="border-input bg-background h-10 w-full rounded-md border px-3 text-sm"
            value={values.category ?? "safety"}
            onChange={(event) => set("category", event.target.value)}
          >
            {FEATURE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      )}

      {has("currency") && (
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={values.currency ?? "HKD"}
            onChange={(event) => set("currency", event.target.value)}
          />
        </div>
      )}

      {has("unit") && (
        <div className="space-y-2">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={values.unit ?? "cc"}
            onChange={(event) => set("unit", event.target.value)}
          />
        </div>
      )}

      {(has("min") || has("max") || has("minCc") || has("maxCc")) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {has("min") && (
            <NumberField
              id="min"
              label="Minimum"
              value={values.min}
              onChange={(value) => set("min", value)}
            />
          )}
          {has("max") && (
            <NumberField
              id="max"
              label="Maximum"
              value={values.max}
              onChange={(value) => set("max", value)}
            />
          )}
          {has("minCc") && (
            <NumberField
              id="minCc"
              label="Minimum cc"
              value={values.minCc}
              onChange={(value) => set("minCc", value)}
            />
          )}
          {has("maxCc") && (
            <NumberField
              id="maxCc"
              label="Maximum cc"
              value={values.maxCc}
              onChange={(value) => set("maxCc", value)}
            />
          )}
        </div>
      )}

      {has("isElectric") && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(values.isElectric)}
            onChange={(event) => set("isElectric", event.target.checked)}
          />
          Electric powertrain
        </label>
      )}

      {has("requiresEngineSize") && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(values.requiresEngineSize)}
            onChange={(event) =>
              set("requiresEngineSize", event.target.checked)
            }
          />
          Requires engine size
        </label>
      )}

      {has("isActive") && (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.isActive !== false}
            onChange={(event) => set("isActive", event.target.checked)}
          />
          Active
        </label>
      )}

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : submitLabel}
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
  value: number | null | undefined
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
