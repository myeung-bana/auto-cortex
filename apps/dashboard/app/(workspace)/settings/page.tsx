import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
} from "@autocore/ui"
import { Settings, Users } from "lucide-react"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session/mock-session"
import { ROUTES } from "@/lib/constants/routes"
import { BUSINESS_NATURE_LABELS } from "@autocore/utils"

export default async function SettingsPage() {
  const user = await getSessionUser()
  if (!user) return null

  const provider = getDataProvider()
  const businessSpace = await provider.getBusinessSpace(user.businessSpaceId)
  if (!businessSpace) return null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your Business Space configuration."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              Space Profile
            </CardTitle>
            <CardDescription>Your business space details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground">Space Name</p>
              <p className="font-medium">{businessSpace.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Business Nature</p>
              <p className="font-medium">
                {BUSINESS_NATURE_LABELS[businessSpace.nature]}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Seat Limit</p>
              <p className="font-medium">{businessSpace.seatLimit} seats</p>
            </div>
          </CardContent>
        </Card>

        {user.role === "BUSINESS_OWNER" ? (
          <Link href={ROUTES.settingsUsers}>
            <Card className="hover:bg-muted/50 h-full transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5" />
                  Team & Seats
                </CardTitle>
                <CardDescription>
                  Manage users and view seat usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {businessSpace.seatsUsed} of {businessSpace.seatLimit} seats
                  in use
                </p>
              </CardContent>
            </Card>
          </Link>
        ) : (
          <Card className="opacity-60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Team & Seats
              </CardTitle>
              <CardDescription>
                Only Business Owners can manage team members
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}
