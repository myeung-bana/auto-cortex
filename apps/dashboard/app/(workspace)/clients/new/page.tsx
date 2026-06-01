import Link from "next/link"
import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@autocore/ui"
import { ArrowLeft } from "lucide-react"
import { ROUTES } from "@/lib/constants/routes"
import { ClientForm } from "@/components/clients/client-form"
import { createClientAction } from "@/lib/actions/clients"

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Client"
        description="Create a new customer record in your CRM."
        actions={
          <Button asChild variant="outline">
            <Link href={ROUTES.clients}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm onSubmit={createClientAction} submitLabel="Create Client" />
        </CardContent>
      </Card>
    </div>
  )
}
