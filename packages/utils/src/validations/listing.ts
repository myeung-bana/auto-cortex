import { z } from "zod"

const statuses = ["AVAILABLE", "RESERVED", "SOLD", "RENTED"] as const

export const CreateListingSchema = z.object({
  title: z.string().min(2, "Title is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  variant: z.string().optional(),
  year: z.coerce
    .number()
    .int()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  bodyType: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  price: z.coerce.number().min(0).optional(),
  mileage: z.coerce.number().int().min(0).optional(),
  engineCc: z.coerce.number().int().min(0).optional(),
  seats: z.coerce.number().int().min(0).optional(),
  doors: z.coerce.number().int().min(0).optional(),
  features: z.array(z.string()),
  vin: z.string().optional(),
  status: z.enum(statuses),
  description: z.string().optional(),
})

export type CreateListingInput = z.infer<typeof CreateListingSchema>

export const UpdateListingSchema = CreateListingSchema

export type UpdateListingInput = z.infer<typeof UpdateListingSchema>
