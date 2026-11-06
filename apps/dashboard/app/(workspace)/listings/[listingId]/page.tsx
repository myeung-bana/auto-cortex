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
import { Archive, ArrowLeft, Pencil } from "lucide-react"
import { ConfirmAction } from "@/components/actions/confirm-action"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session"
import { ROUTES } from "@/lib/constants/routes"
import { formatDateTime, formatPriceLabel } from "@autocore/utils"
import { getTaxonomyLabeler } from "@/lib/taxonomies/provider"
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
  const [listing, businessSpace, labelFor] = await Promise.all([
    provider.getListing(user.businessSpaceId, listingId),
    provider.getBusinessSpace(user.businessSpaceId),
    getTaxonomyLabeler([
      "makes",
      "body-types",
      "fuel-types",
      "transmissions",
      "exterior-colors",
      "interior-colors",
      "features",
    ]),
  ])
  const linkedClient = listing?.clientId
    ? await provider.getClient(user.businessSpaceId, listing.clientId)
    : null

  if (!listing || listing.isArchived || !businessSpace) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={listing.title}
        description={`${labelFor("makes", listing.make)} ${listing.model} · ${listing.year}`}
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
            <ConfirmAction
              label="Archive listing"
              description={`Archive ${listing.title}? It will be hidden from your inventory.`}
              confirmLabel="Archive listing"
              icon={<Archive className="h-4 w-4" />}
              onConfirm={archiveListingAction.bind(null, listing.id)}
            />
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
            <DetailRow label="Variant" value={listing.variant} />
            <DetailRow label="Body type" value={labelFor("body-types", listing.bodyType)} />
            <DetailRow label="Fuel type" value={labelFor("fuel-types", listing.fuelType)} />
            <DetailRow
              label="Transmission"
              value={labelFor("transmissions", listing.transmission)}
            />
            <DetailRow
              label="Exterior colour"
              value={labelFor("exterior-colors", listing.exteriorColor)}
            />
            <DetailRow
              label="Interior colour"
              value={labelFor("interior-colors", listing.interiorColor)}
            />
            <DetailRow
              label="Mileage"
              value={
                listing.mileage
                  ? `${listing.mileage.value.toLocaleString()} ${listing.mileage.unit}`
                  : null
              }
            />
            <DetailRow
              label="Engine"
              value={listing.engineCc ? `${listing.engineCc.toLocaleString()} cc` : null}
            />
            <DetailRow
              label="Seats"
              value={listing.seats ? String(listing.seats) : null}
            />
            <DetailRow
              label="Doors"
              value={listing.doors ? String(listing.doors) : null}
            />
            <DetailRow label="VIN" value={listing.vin} />
            <DetailRow
              label="Features"
              value={
                listing.features.length
                  ? listing.features
                      .map((feature) => labelFor("features", feature))
                      .join(", ")
                  : null
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
