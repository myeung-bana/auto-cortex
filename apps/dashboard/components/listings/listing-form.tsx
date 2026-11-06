"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@autocore/ui"
import {
  CreateListingSchema,
  type CreateListingInput,
  LISTING_STATUS_LABELS,
  type BusinessNature,
} from "@autocore/utils"
import { toast } from "sonner"
import type { ListingOption } from "@/lib/taxonomies/types"

export interface ListingFormOptions {
  makes: ListingOption[]
  bodyTypes: ListingOption[]
  transmissions: ListingOption[]
  fuelTypes: ListingOption[]
  exteriorColors: ListingOption[]
  interiorColors: ListingOption[]
  features: ListingOption[]
}

interface ListingFormProps {
  nature: BusinessNature
  options: ListingFormOptions
  defaultValues?: Partial<CreateListingInput>
  onSubmit: (values: CreateListingInput) => Promise<void>
  submitLabel?: string
}

const FEATURE_GROUPS = ["safety", "comfort", "technology", "exterior"] as const

export function ListingForm({
  nature,
  options,
  defaultValues,
  onSubmit,
  submitLabel = "Save Listing",
}: ListingFormProps) {
  const form = useForm<CreateListingInput>({
    resolver: zodResolver(CreateListingSchema),
    defaultValues: {
      title: "",
      make: "",
      model: "",
      variant: "",
      year: new Date().getFullYear(),
      bodyType: "",
      transmission: "",
      fuelType: "",
      exteriorColor: "",
      interiorColor: "",
      features: [],
      vin: "",
      status: "AVAILABLE",
      description: "",
      ...defaultValues,
    },
  })

  async function handleSubmit(values: CreateListingInput) {
    try {
      await onSubmit(values)
      toast.success("Listing saved successfully")
    } catch (error) {
      if (isRedirect(error)) throw error
      toast.error("Failed to save listing")
    }
  }

  const { register, handleSubmit: rhfHandleSubmit, formState, setValue, watch } =
    form
  const status = watch("status")
  const features = watch("features") ?? []
  const priceLabel =
    nature === "LUXURY_CAR_RENTAL" ? "Daily rate" : "Asking price (HKD)"

  const relevantStatuses =
    nature === "SECOND_HAND_DEALER"
      ? (["AVAILABLE", "RESERVED", "SOLD"] as const)
      : (["AVAILABLE", "RENTED"] as const)

  function toggleFeature(slug: string) {
    const next = features.includes(slug)
      ? features.filter((item) => item !== slug)
      : [...features, slug]
    setValue("features", next)
  }

  return (
    <form onSubmit={rhfHandleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Listing title *</Label>
        <Input id="title" placeholder="AUDI Q2 35 TFSI" {...register("title")} />
        {formState.errors.title && (
          <p className="text-destructive text-sm">{formState.errors.title.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SlugSelect
          label="Make *"
          value={watch("make")}
          options={options.makes}
          onChange={(value) => setValue("make", value)}
        />
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input id="model" {...register("model")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="variant">Variant</Label>
          <Input id="variant" {...register("variant")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Input id="year" type="number" {...register("year")} />
        </div>
        <SlugSelect
          label="Body type"
          value={watch("bodyType")}
          options={options.bodyTypes}
          onChange={(value) => setValue("bodyType", value)}
          allowEmpty
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <SlugSelect
          label="Fuel type"
          value={watch("fuelType")}
          options={options.fuelTypes}
          onChange={(value) => setValue("fuelType", value)}
          allowEmpty
        />
        <SlugSelect
          label="Transmission"
          value={watch("transmission")}
          options={options.transmissions}
          onChange={(value) => setValue("transmission", value)}
          allowEmpty
        />
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(value) =>
              setValue("status", value as CreateListingInput["status"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {relevantStatuses.map((item) => (
                <SelectItem key={item} value={item}>
                  {LISTING_STATUS_LABELS[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SlugSelect
          label="Exterior colour"
          value={watch("exteriorColor")}
          options={options.exteriorColors}
          onChange={(value) => setValue("exteriorColor", value)}
          allowEmpty
        />
        <SlugSelect
          label="Interior colour"
          value={watch("interiorColor")}
          options={options.interiorColors}
          onChange={(value) => setValue("interiorColor", value)}
          allowEmpty
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">{priceLabel}</Label>
          <Input id="price" type="number" {...register("price")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage (km)</Label>
          <Input id="mileage" type="number" {...register("mileage")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="engineCc">Engine (cc)</Label>
          <Input id="engineCc" type="number" {...register("engineCc")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="doors">Doors</Label>
          <Input id="doors" type="number" {...register("doors")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vin">VIN</Label>
          <Input id="vin" {...register("vin")} />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Features</Label>
        {FEATURE_GROUPS.map((group) => {
          const groupFeatures = options.features.filter(
            (feature) => feature.category === group
          )
          if (groupFeatures.length === 0) return null
          return (
            <div key={group}>
              <p className="text-muted-foreground mb-2 text-xs capitalize">
                {group}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {groupFeatures.map((feature) => (
                  <label key={feature.slug} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={features.includes(feature.slug)}
                      onChange={() => toggleFeature(feature.slug)}
                    />
                    {feature.label}
                  </label>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} {...register("description")} />
      </div>

      {formState.errors.make && (
        <p className="text-destructive text-sm">{formState.errors.make.message}</p>
      )}

      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}

function SlugSelect({
  label,
  value,
  options,
  onChange,
  allowEmpty = false,
}: {
  label: string
  value?: string
  options: ListingOption[]
  onChange: (value: string) => void
  allowEmpty?: boolean
}) {
  const items =
    value && !options.some((option) => option.slug === value)
      ? [{ slug: value, label: value }, ...options]
      : options

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value || (allowEmpty ? "none" : undefined)}
        onValueChange={(next) => onChange(next === "none" ? "" : next)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {allowEmpty && <SelectItem value="none">None</SelectItem>}
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

function isRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  )
}
