"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  Input,
  Label,
  Textarea,
} from "@autocore/ui"
import {
  CreateClientSchema,
  type CreateClientInput,
} from "@autocore/utils"
import { toast } from "sonner"

interface ClientFormProps {
  defaultValues?: Partial<CreateClientInput>
  onSubmit: (values: CreateClientInput) => Promise<void>
  submitLabel?: string
}

export function ClientForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save Client",
}: ClientFormProps) {
  const form = useForm<CreateClientInput>({
    resolver: zodResolver(CreateClientSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      ...defaultValues,
    },
  })

  async function handleSubmit(values: CreateClientInput) {
    try {
      await onSubmit(values)
      toast.success("Client saved successfully")
    } catch {
      toast.error("Failed to save client")
    }
  }

  const { register, handleSubmit: rhfHandleSubmit, formState } = form

  return (
    <form
      onSubmit={rhfHandleSubmit(handleSubmit)}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          placeholder="John Doe"
          {...register("fullName")}
        />
        {formState.errors.fullName && (
          <p className="text-destructive text-sm">
            {formState.errors.fullName.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
          />
          {formState.errors.email && (
            <p className="text-destructive text-sm">
              {formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="+1 555-0100"
            {...register("phone")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="123 Main St, City"
          {...register("address")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Internal notes about this client..."
          rows={4}
          {...register("notes")}
        />
      </div>

      <Button type="submit" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </form>
  )
}
