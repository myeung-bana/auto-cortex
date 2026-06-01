import type { ListingStatus } from "@autocore/utils"
import { LISTING_STATUS_LABELS } from "@autocore/utils"
import { Badge } from "@autocore/ui"

const VARIANT_MAP: Record<
  ListingStatus,
  "success" | "warning" | "default" | "secondary"
> = {
  AVAILABLE: "success",
  RESERVED: "warning",
  SOLD: "default",
  RENTED: "secondary",
}

export function ListingStatusBadge({ status }: { status: ListingStatus }) {
  return (
    <Badge variant={VARIANT_MAP[status]}>
      {LISTING_STATUS_LABELS[status]}
    </Badge>
  )
}
