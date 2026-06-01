import { Card, CardContent, CardHeader, CardTitle } from "@autocore/ui"

interface SeatUsageMeterProps {
  seatsUsed: number
  seatLimit: number
}

export function SeatUsageMeter({ seatsUsed, seatLimit }: SeatUsageMeterProps) {
  const percentage = Math.round((seatsUsed / seatLimit) * 100)
  const remaining = seatLimit - seatsUsed

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Seat Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>
            {seatsUsed} of {seatLimit} seats used
          </span>
          <span className="text-muted-foreground">{remaining} remaining</span>
        </div>
        <div className="bg-muted h-3 overflow-hidden rounded-full">
          <div
            className="bg-primary h-full rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
