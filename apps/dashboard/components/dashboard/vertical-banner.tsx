import { Badge } from "@autocore/ui"
import type { BusinessSpace } from "@autocore/utils"
import { BUSINESS_NATURE_LABELS } from "@autocore/utils"
import { Car, Sparkles } from "lucide-react"

interface VerticalBannerProps {
  businessSpace: BusinessSpace
}

export function VerticalBanner({ businessSpace }: VerticalBannerProps) {
  const isDealer = businessSpace.nature === "SECOND_HAND_DEALER"

  return (
    <div className="from-primary/5 to-primary/10 flex items-start gap-4 rounded-lg border bg-gradient-to-r p-4">
      <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
        {isDealer ? (
          <Car className="text-primary h-5 w-5" />
        ) : (
          <Sparkles className="text-primary h-5 w-5" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="font-medium">{businessSpace.name}</p>
          <Badge variant="outline">
            {BUSINESS_NATURE_LABELS[businessSpace.nature]}
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {isDealer
            ? "Track inventory, manage leads, and close sales from one place."
            : "Manage your premium fleet, bookings, and client relationships."}
        </p>
      </div>
    </div>
  )
}
