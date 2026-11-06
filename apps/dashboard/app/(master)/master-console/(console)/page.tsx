import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
} from "@autocore/ui"
import { formatRelativeTime } from "@autocore/utils"
import { isMockMode } from "@/lib/config"
import { getOverview } from "@/lib/master/provider"
import { getMasterSession } from "@/lib/session"

const SYSTEM_STATUS = isMockMode()
  ? [
      { label: "Data provider", value: "In-memory mock" },
      { label: "Authentication", value: "Mock cookies" },
      { label: "Media storage", value: "Static URLs" },
    ]
  : [
      { label: "Data provider", value: "Nhost functions" },
      { label: "Authentication", value: "Nhost Auth" },
      { label: "Media storage", value: "Static URLs" },
    ]

export default async function MasterOverviewPage() {
  if (!(await getMasterSession())) return null
  const { stats: overview, events } = await getOverview(8)

  const stats = [
    {
      label: "Active spaces",
      value: overview.activeSpaces,
      hint: `${overview.suspendedSpaces} suspended`,
    },
    { label: "Active users", value: overview.totalUsers, hint: "Across all spaces" },
    { label: "Listings", value: overview.totalListings, hint: "Not archived" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Platform-wide health and recent administrative activity."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-xs">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System status</CardTitle>
            <CardDescription>Prototype environment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {SYSTEM_STATUS.map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <Badge variant="secondary">{item.value}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent audit log</CardTitle>
            <CardDescription>Business Space changes made from this console</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <p className="text-muted-foreground text-sm">No activity yet.</p>
            ) : (
              <ul className="space-y-3">
                {events.map((event) => (
                  <li key={event.id} className="flex items-center justify-between gap-4 text-sm">
                    <span>{event.description}</span>
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {formatRelativeTime(event.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
