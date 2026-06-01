import { z } from "zod"

export const CreateClientSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export type CreateClientInput = z.infer<typeof CreateClientSchema>

export const UpdateClientSchema = CreateClientSchema

export type UpdateClientInput = z.infer<typeof UpdateClientSchema>
