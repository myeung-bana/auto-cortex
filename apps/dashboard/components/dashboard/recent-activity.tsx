import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@autocore/ui"
import { formatRelativeTime } from "@autocore/utils"
import type { ActivityEvent } from "@autocore/utils"
import { Activity } from "lucide-react"

interface RecentActivityProps {
  events: ActivityEvent[]
}

export function RecentActivity({ events }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest updates in your business space</CardDescription>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-muted-foreground text-sm">No recent activity.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="flex gap-3">
                <div className="bg-primary/10 mt-1 h-2 w-2 shrink-0 rounded-full" />
                <div>
                  <p className="text-sm">{event.description}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatRelativeTime(event.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
