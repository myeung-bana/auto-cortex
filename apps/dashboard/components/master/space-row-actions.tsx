"use client"

import Link from "next/link"
import { Pause, Pencil, Play, Trash2 } from "lucide-react"
import { Button } from "@autocore/ui"
import { toast } from "sonner"
import { ConfirmAction } from "@/components/actions/confirm-action"
import { ROUTES } from "@/lib/constants/routes"
import { deleteSpaceAction, setSpaceActiveAction } from "@/lib/actions/master"

export function SpaceRowActions({
  id,
  name,
  isActive,
}: {
  id: string
  name: string
  isActive: boolean
}) {
  return (
    <div className="flex justify-end gap-1">
      <Button asChild variant="ghost" size="icon">
        <Link href={ROUTES.masterSpaceEdit(id)} aria-label="Edit">
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <ConfirmAction
        label={isActive ? "Suspend Business Space" : "Restore Business Space"}
        description={
          isActive
            ? `Users of ${name} will be signed out and unable to sign in until it is restored.`
            : `Users of ${name} will be able to sign in again.`
        }
        confirmLabel={isActive ? "Suspend" : "Restore"}
        icon={isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        onConfirm={async () => {
          await setSpaceActiveAction(id, !isActive)
          toast.success(isActive ? `${name} suspended` : `${name} restored`)
        }}
      />
      <ConfirmAction
        label="Delete Business Space"
        description={`This permanently removes ${name} with its users, clients, and listings.`}
        confirmLabel="Delete"
        icon={<Trash2 className="h-4 w-4" />}
        onConfirm={async () => {
          await deleteSpaceAction(id)
          toast.success(`${name} deleted`)
        }}
      />
    </div>
  )
}
