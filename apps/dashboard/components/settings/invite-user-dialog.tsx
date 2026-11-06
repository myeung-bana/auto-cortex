"use client"

import { useState } from "react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@autocore/ui"
import { UserPlus } from "lucide-react"
import { toast } from "sonner"
import { inviteUserAction } from "@/lib/actions/users"
import { isMockMode } from "@/lib/config"

interface InviteUserDialogProps {
  seatsUsed: number
  seatLimit: number
}

export function InviteUserDialog({
  seatsUsed,
  seatLimit,
}: InviteUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const atLimit = seatsUsed >= seatLimit

  async function handleInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setPending(true)
    setError(null)
    const result = await inviteUserAction({
      email: String(form.get("email") ?? ""),
      displayName: String(form.get("displayName") ?? ""),
    })
    setPending(false)
    if (result.error) {
      setError(result.error)
      return
    }
    if (result.notice) toast.info(result.notice)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        setError(null)
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={atLimit}>
          <UserPlus className="h-4 w-4" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            {atLimit
              ? "You've reached your seat limit. Contact your platform admin to upgrade."
              : "Send an email invitation to add a new user to your Business Space."}
          </DialogDescription>
        </DialogHeader>
        {!atLimit && (
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="colleague@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                name="displayName"
                placeholder="Jane Smith"
                minLength={2}
                required
              />
            </div>
            {error && <p className="text-destructive text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Sending…" : "Send Invitation"}
            </Button>
            {isMockMode() && (
              <p className="text-muted-foreground text-center text-xs">
                Prototype mode — invitation is UI only
              </p>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
