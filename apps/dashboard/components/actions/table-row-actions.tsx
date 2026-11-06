import Link from "next/link"
import { Button } from "@autocore/ui"
import { Eye, Pencil } from "lucide-react"
import { ConfirmAction } from "./confirm-action"

interface DestructiveAction {
  label: string
  description: string
  confirmLabel: string
  icon: React.ReactNode
  onConfirm: () => void | Promise<void>
}

export function TableRowActions({
  viewHref,
  editHref,
  destructive,
}: {
  viewHref?: string
  editHref?: string
  destructive?: DestructiveAction
}) {
  return (
    <div className="flex justify-end gap-1">
      {viewHref && (
        <Button asChild variant="ghost" size="icon">
          <Link href={viewHref} aria-label="View">
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      )}
      {editHref && (
        <Button asChild variant="ghost" size="icon">
          <Link href={editHref} aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>
      )}
      {destructive && (
        <ConfirmAction
          label={destructive.label}
          description={destructive.description}
          confirmLabel={destructive.confirmLabel}
          icon={destructive.icon}
          onConfirm={destructive.onConfirm}
        />
      )}
    </div>
  )
}
