import { redirect } from "next/navigation"
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@autocore/ui"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session"
import { ROUTES } from "@/lib/constants/routes"
import { USER_ROLE_LABELS } from "@autocore/utils"
import { SeatUsageMeter } from "@/components/settings/seat-usage-meter"
import { InviteUserDialog } from "@/components/settings/invite-user-dialog"

export default async function UserManagementPage() {
  const user = await getSessionUser()
  if (!user) return null

  if (user.role !== "BUSINESS_OWNER") {
    redirect(ROUTES.dashboard)
  }

  const provider = getDataProvider()
  const [businessSpace, users] = await Promise.all([
    provider.getBusinessSpace(user.businessSpaceId),
    provider.getUsers(user.businessSpaceId),
  ])

  if (!businessSpace) return null

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage users and seat usage in your Business Space."
        actions={
          user.role === "BUSINESS_OWNER" ? (
            <InviteUserDialog
              seatsUsed={businessSpace.seatsUsed}
              seatLimit={businessSpace.seatLimit}
            />
          ) : undefined
        }
      />

      <SeatUsageMeter
        seatsUsed={businessSpace.seatsUsed}
        seatLimit={businessSpace.seatLimit}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Team Members</CardTitle>
          <CardDescription>
            {users.length} active user{users.length !== 1 ? "s" : ""} in this
            space
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    {member.displayName}
                    {member.id === user.id && (
                      <Badge variant="outline" className="ml-2">
                        You
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.role === "BUSINESS_OWNER" ? "default" : "secondary"
                      }
                    >
                      {USER_ROLE_LABELS[member.role]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
