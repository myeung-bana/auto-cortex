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
import {
  CONDITION_LABELS,
  FUEL_TYPE_LABELS,
  TRANSMISSION_LABELS,
  formatDateTime,
  formatPriceLabel,
} from "@autocore/utils"
import { ListingStatusBadge } from "@/components/listings/listing-status-badge"
import { archiveListingAction } from "@/lib/actions/listings"

interface ListingDetailPageProps {
  params: Promise<{ listingId: string }>
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const user = await getSessionUser()
  if (!user) return null

  const { listingId } = await params
  const provider = getDataProvider()
  const [listing, businessSpace, linkedClient] = await Promise.all([
    provider.getListing(user.businessSpaceId, listingId),
    provider.getBusinessSpace(user.businessSpaceId),
    provider.getListing(user.businessSpaceId, listingId).then(async (l) => {
      if (!l?.clientId) return null
      return provider.getClient(user.businessSpaceId, l.clientId)
    }),
  ])

  if (!listing || listing.isArchived || !businessSpace) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={listing.title}
        description={`${listing.make} ${listing.model} · ${listing.year}`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={ROUTES.listings}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={ROUTES.listingEdit(listing.id)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
            <form action={archiveListingAction.bind(null, listing.id)}>
              <Button type="submit" variant="destructive">
                <Trash2 className="h-4 w-4" />
                Archive
              </Button>
            </form>
          </div>
        }
      />

      <div className="flex items-center gap-3">
        <ListingStatusBadge status={listing.status} />
        <span className="text-muted-foreground text-sm">
          Updated {formatDateTime(listing.updatedAt)}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vehicle Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <DetailRow
              label="Price"
              value={formatPriceLabel(businessSpace.nature, listing.price)}
            />
            <DetailRow label="VIN" value={listing.vin} />
            <DetailRow label="Colour" value={listing.colour} />
            <DetailRow
              label="Mileage"
              value={listing.mileage ? `${listing.mileage.toLocaleString()} km` : null}
            />
            <DetailRow
              label="Fuel Type"
              value={listing.fuelType ? FUEL_TYPE_LABELS[listing.fuelType] : null}
            />
            <DetailRow
              label="Transmission"
              value={
                listing.transmission
                  ? TRANSMISSION_LABELS[listing.transmission]
                  : null
              }
            />
            <DetailRow
              label="Condition"
              value={
                listing.condition ? CONDITION_LABELS[listing.condition] : null
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Linked Client</CardTitle>
          </CardHeader>
          <CardContent>
            {linkedClient ? (
              <Link
                href={ROUTES.clientDetail(linkedClient.id)}
                className="text-primary font-medium hover:underline"
              >
                {linkedClient.fullName}
              </Link>
            ) : (
              <p className="text-muted-foreground text-sm">No client linked</p>
            )}
          </CardContent>
        </Card>
      </div>

      {listing.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{listing.description}</p>
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
