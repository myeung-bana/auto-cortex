"use client"

import { useActionState } from "react"
import Link from "next/link"
import { Button, Input, Label } from "@autocore/ui"
import { signInWithPasswordAction, type FormState } from "@/lib/actions/auth"
import type { AuthPortal } from "@/lib/auth/portal"
import { ROUTES } from "@/lib/constants/routes"

export function LoginForm({ portal = "workspace" }: { portal?: AuthPortal }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    signInWithPasswordAction,
    {}
  )

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="portal" value={portal} />
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.email}
          key={state.email}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href={ROUTES.forgotPassword}
            className="text-muted-foreground text-xs hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {state.error && <p className="text-destructive text-sm">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  )
}
