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

interface InviteUserDialogProps {
  seatsUsed: number
  seatLimit: number
}

export function InviteUserDialog({
  seatsUsed,
  seatLimit,
}: InviteUserDialogProps) {
  const [open, setOpen] = useState(false)
  const atLimit = seatsUsed >= seatLimit

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    toast.info("User invitations will be available when connected to the backend.")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                type="email"
                placeholder="colleague@company.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" placeholder="Jane Smith" required />
            </div>
            <Button type="submit" className="w-full">
              Send Invitation
            </Button>
            <p className="text-muted-foreground text-center text-xs">
              Prototype mode — invitation is UI only
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
