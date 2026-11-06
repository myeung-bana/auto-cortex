import Link from "next/link"
import { notFound } from "next/navigation"
import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@autocore/ui"
import { ArrowLeft } from "lucide-react"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session"
import { ROUTES } from "@/lib/constants/routes"
import { ClientForm } from "@/components/clients/client-form"
import { updateClientAction } from "@/lib/actions/clients"

interface EditClientPageProps {
  params: Promise<{ clientId: string }>
}

export default async function EditClientPage({ params }: EditClientPageProps) {
  const user = await getSessionUser()
  if (!user) return null

  const { clientId } = await params
  const provider = getDataProvider()
  const client = await provider.getClient(user.businessSpaceId, clientId)

  if (!client || client.isArchived) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Client"
        description={`Update details for ${client.fullName}`}
        actions={
          <Button asChild variant="outline">
            <Link href={ROUTES.clientDetail(client.id)}>
              <ArrowLeft className="h-4 w-4" />
              Cancel
            </Link>
          </Button>
        }
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm
            defaultValues={{
              fullName: client.fullName,
              email: client.email ?? "",
              phone: client.phone ?? "",
              address: client.address ?? "",
              notes: client.notes ?? "",
            }}
            onSubmit={updateClientAction.bind(null, clientId)}
            submitLabel="Update Client"
          />
        </CardContent>
      </Card>
    </div>
  )
}
