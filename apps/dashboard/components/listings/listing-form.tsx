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
  CONDITION_LABELS,
  FUEL_TYPE_LABELS,
  LISTING_STATUS_LABELS,
  TRANSMISSION_LABELS,
  type BusinessNature,
} from "@autocore/utils"
import { toast } from "sonner"

interface ListingFormProps {
  nature: BusinessNature
  defaultValues?: Partial<CreateListingInput>
  onSubmit: (values: CreateListingInput) => Promise<void>
  submitLabel?: string
}

export function ListingForm({
  nature,
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
      year: new Date().getFullYear(),
      vin: "",
      colour: "",
      status: "AVAILABLE",
      description: "",
      ...defaultValues,
    },
  })

  async function handleSubmit(values: CreateListingInput) {
    try {
      await onSubmit(values)
      toast.success("Listing saved successfully")
    } catch {
      toast.error("Failed to save listing")
    }
  }

  const { register, handleSubmit: rhfHandleSubmit, formState, setValue, watch } =
    form
  const status = watch("status")

  const priceLabel =
    nature === "LUXURY_CAR_RENTAL" ? "Daily Rate ($)" : "Asking Price ($)"

  const relevantStatuses =
    nature === "SECOND_HAND_DEALER"
      ? (["AVAILABLE", "RESERVED", "SOLD"] as const)
      : (["AVAILABLE", "RENTED"] as const)

  return (
    <form onSubmit={rhfHandleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Listing Title *</Label>
        <Input
          id="title"
          placeholder="2021 BMW 5 Series"
          {...register("title")}
        />
        {formState.errors.title && (
          <p className="text-destructive text-sm">
            {formState.errors.title.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="make">Make *</Label>
          <Input id="make" placeholder="BMW" {...register("make")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input id="model" placeholder="5 Series" {...register("model")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Input id="year" type="number" {...register("year")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">{priceLabel}</Label>
          <Input id="price" type="number" {...register("price")} />
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(v) =>
              setValue("status", v as CreateListingInput["status"])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {relevantStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {LISTING_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="vin">VIN</Label>
          <Input id="vin" {...register("vin")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="colour">Colour</Label>
          <Input id="colour" {...register("colour")} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage (km)</Label>
          <Input id="mileage" type="number" {...register("mileage")} />
        </div>
        <div className="space-y-2">
          <Label>Fuel Type</Label>
          <Select
            onValueChange={(v) =>
              setValue("fuelType", v as CreateListingInput["fuelType"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FUEL_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Transmission</Label>
          <Select
            onValueChange={(v) =>
              setValue("transmission", v as CreateListingInput["transmission"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TRANSMISSION_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Condition</Label>
        <Select
          onValueChange={(v) =>
            setValue("condition", v as CreateListingInput["condition"])
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CONDITION_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Vehicle description..."
          {...register("description")}
        />
      </div>

      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
