import Link from "next/link"
import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@autocore/ui"
import { ArrowLeft } from "lucide-react"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session/mock-session"
import { ROUTES } from "@/lib/constants/routes"
import { ListingForm } from "@/components/listings/listing-form"
import { createListingAction } from "@/lib/actions/listings"

export default async function NewListingPage() {
  const user = await getSessionUser()
  if (!user) return null

  const provider = getDataProvider()
  const businessSpace = await provider.getBusinessSpace(user.businessSpaceId)
  if (!businessSpace) return null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add Listing"
        description="Create a new vehicle listing in your inventory."
        actions={
          <Button asChild variant="outline">
            <Link href={ROUTES.listings}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Listing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ListingForm
            nature={businessSpace.nature}
            onSubmit={createListingAction}
            submitLabel="Create Listing"
          />
        </CardContent>
      </Card>
    </div>
  )
}
