import Link from "next/link"
import { Plus } from "lucide-react"
import {
  Badge,
  Button,
  Card,
  CardContent,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@autocore/ui"
import { BUSINESS_NATURE_LABELS, formatDate } from "@autocore/utils"
import { ROUTES } from "@/lib/constants/routes"
import { listSpaces } from "@/lib/master/provider"
import { getMasterSession } from "@/lib/session"
import { SpaceRowActions } from "@/components/master/space-row-actions"

export default async function MasterSpacesPage() {
  if (!(await getMasterSession())) return null
  const spaces = await listSpaces()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Spaces"
        description="Provision, configure, and suspend tenant spaces."
        actions={
          <Button asChild>
            <Link href={ROUTES.masterSpaceNew}>
              <Plus className="mr-2 h-4 w-4" />
              New space
            </Link>
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Nature</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spaces.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-muted-foreground text-center">
                    No Business Spaces yet.
                  </TableCell>
                </TableRow>
              )}
              {spaces.map((space) => (
                <TableRow key={space.id}>
                  <TableCell className="font-medium">{space.name}</TableCell>
                  <TableCell>{BUSINESS_NATURE_LABELS[space.nature]}</TableCell>
                  <TableCell>{space.ownerName ?? "—"}</TableCell>
                  <TableCell>
                    {space.seatsUsed} / {space.seatLimit}
                  </TableCell>
                  <TableCell>{space.listingCount}</TableCell>
                  <TableCell>
                    <Badge variant={space.isActive ? "default" : "secondary"}>
                      {space.isActive ? "Active" : "Suspended"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(space.createdAt)}</TableCell>
                  <TableCell>
                    <SpaceRowActions
                      id={space.id}
                      name={space.name}
                      isActive={space.isActive}
                    />
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
