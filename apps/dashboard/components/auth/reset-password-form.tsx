"use client"

import { useActionState } from "react"
import { Button, Input, Label } from "@autocore/ui"
import { setPasswordAction, type FormState } from "@/lib/actions/auth"

export function ResetPasswordForm({ ticket }: { ticket: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    setPasswordAction,
    {}
  )

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="ticket" value={state.ticket ?? ticket} />
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={9}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          minLength={9}
          required
        />
      </div>
      {state.error && <p className="text-destructive text-sm">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Set password and sign in"}
      </Button>
    </form>
  )
}
