import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
  Separator,
} from "@autocore/ui"
import { ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session/mock-session"
import { ROUTES } from "@/lib/constants/routes"
import { formatDateTime } from "@autocore/utils"
import { archiveClientAction } from "@/lib/actions/clients"

interface ClientDetailPageProps {
  params: Promise<{ clientId: string }>
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const user = await getSessionUser()
  if (!user) return null

  const { clientId } = await params
  const provider = getDataProvider()
  const client = await provider.getClient(user.businessSpaceId, clientId)

  if (!client || client.isArchived) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={client.fullName}
        description="Client profile and contact details"
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={ROUTES.clients}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={ROUTES.clientEdit(client.id)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
            <form action={archiveClientAction.bind(null, client.id)}>
              <Button type="submit" variant="destructive">
                <Trash2 className="h-4 w-4" />
                Archive
              </Button>
            </form>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Email" value={client.email} />
            <DetailRow label="Phone" value={client.phone} />
            <DetailRow label="Address" value={client.address} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Record Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow label="Created" value={formatDateTime(client.createdAt)} />
            <DetailRow label="Updated" value={formatDateTime(client.updatedAt)} />
          </CardContent>
        </Card>
      </div>

      {client.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{client.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      <p className="font-medium">{value ?? "—"}</p>
      <Separator className="mt-4" />
    </div>
  )
}
