import { z } from "zod"

const fuelTypes = ["PETROL", "DIESEL", "ELECTRIC", "HYBRID"] as const
const transmissions = ["AUTOMATIC", "MANUAL"] as const
const conditions = ["NEW", "USED", "CERTIFIED_PRE_OWNED"] as const
const statuses = ["AVAILABLE", "RESERVED", "SOLD", "RENTED"] as const

export const CreateListingSchema = z.object({
  title: z.string().min(2, "Title is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce
    .number()
    .int()
    .min(1900, "Invalid year")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  vin: z.string().optional(),
  colour: z.string().optional(),
  mileage: z.coerce.number().int().min(0).optional(),
  fuelType: z.enum(fuelTypes).optional(),
  transmission: z.enum(transmissions).optional(),
  condition: z.enum(conditions).optional(),
  price: z.coerce.number().min(0, "Price must be positive").optional(),
  status: z.enum(statuses),
  description: z.string().optional(),
  clientId: z.string().optional(),
})

export type CreateListingInput = z.infer<typeof CreateListingSchema>

export const UpdateListingSchema = CreateListingSchema

export type UpdateListingInput = z.infer<typeof UpdateListingSchema>
