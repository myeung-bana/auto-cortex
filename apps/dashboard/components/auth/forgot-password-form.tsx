"use client"

import { useActionState } from "react"
import { Button, Input, Label } from "@autocore/ui"
import { requestPasswordResetAction, type FormState } from "@/lib/actions/auth"

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(
    requestPasswordResetAction,
    {}
  )

  if (state.message) {
    return <p className="text-muted-foreground text-sm">{state.message}</p>
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      {state.error && <p className="text-destructive text-sm">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  )
}
