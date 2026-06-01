import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@autocore/ui"
import type { BusinessNature, ListingStatus } from "@autocore/utils"
import { LISTING_STATUS_LABELS } from "@autocore/utils"
import { BarChart3 } from "lucide-react"

interface ListingsByStatusProps {
  stats: Record<ListingStatus, number>
  nature: BusinessNature
}

const STATUS_VARIANT: Record<
  ListingStatus,
  "success" | "warning" | "default" | "secondary"
> = {
  AVAILABLE: "success",
  RESERVED: "warning",
  SOLD: "default",
  RENTED: "secondary",
}

export function ListingsByStatus({ stats, nature }: ListingsByStatusProps) {
  const relevantStatuses: ListingStatus[] =
    nature === "SECOND_HAND_DEALER"
      ? ["AVAILABLE", "RESERVED", "SOLD"]
      : ["AVAILABLE", "RENTED"]

  const total = relevantStatuses.reduce((sum, s) => sum + stats[s], 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5" />
          Listings by Status
        </CardTitle>
        <CardDescription>
          {total} active listings in your inventory
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {relevantStatuses.map((status) => {
          const count = stats[status]
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0

          return (
            <div key={status} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant={STATUS_VARIANT[status]}>
                    {LISTING_STATUS_LABELS[status]}
                  </Badge>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <span className="text-muted-foreground">{percentage}%</span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
