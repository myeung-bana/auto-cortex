import Link from "next/link"
import { notFound } from "next/navigation"
import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@autocore/ui"
import { ArrowLeft } from "lucide-react"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session/mock-session"
import { ROUTES } from "@/lib/constants/routes"
import { ListingForm } from "@/components/listings/listing-form"
import { updateListingAction } from "@/lib/actions/listings"

interface EditListingPageProps {
  params: Promise<{ listingId: string }>
}

export default async function EditListingPage({ params }: EditListingPageProps) {
  const user = await getSessionUser()
  if (!user) return null

  const { listingId } = await params
  const provider = getDataProvider()
  const [listing, businessSpace] = await Promise.all([
    provider.getListing(user.businessSpaceId, listingId),
    provider.getBusinessSpace(user.businessSpaceId),
  ])

  if (!listing || listing.isArchived || !businessSpace) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Listing"
        description={`Update details for ${listing.title}`}
        actions={
          <Button asChild variant="outline">
            <Link href={ROUTES.listingDetail(listing.id)}>
              <ArrowLeft className="h-4 w-4" />
              Cancel
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
            defaultValues={{
              title: listing.title,
              make: listing.make,
              model: listing.model,
              year: listing.year,
              vin: listing.vin ?? "",
              colour: listing.colour ?? "",
              mileage: listing.mileage ?? undefined,
              fuelType: listing.fuelType ?? undefined,
              transmission: listing.transmission ?? undefined,
              condition: listing.condition ?? undefined,
              price: listing.price ?? undefined,
              status: listing.status,
              description: listing.description ?? "",
            }}
            onSubmit={updateListingAction.bind(null, listingId)}
            submitLabel="Update Listing"
          />
        </CardContent>
      </Card>
    </div>
  )
}
