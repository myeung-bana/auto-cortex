import Link from "next/link"
import {
  Button,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@autocore/ui"
import { Archive, Car, Plus } from "lucide-react"
import { TableRowActions } from "@/components/actions/table-row-actions"
import { archiveListingAction } from "@/lib/actions/listings"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session"
import { ROUTES } from "@/lib/constants/routes"
import { formatPriceLabel, type ListingStatus } from "@autocore/utils"
import { getTaxonomyLabeler } from "@/lib/taxonomies/provider"
import { ListingStatusBadge } from "@/components/listings/listing-status-badge"
import { ListingSearch } from "@/components/listings/listing-search"
import { ListingViewToggle } from "@/components/listings/listing-view-toggle"
import { listingCoverUrl } from "@/lib/listings/cover-image"
import { ListingImage } from "@/components/listings/listing-image"

interface ListingsPageProps {
  searchParams: Promise<{ q?: string; status?: string; view?: string }>
}

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  const user = await getSessionUser()
  if (!user) return null

  const { q, status, view: viewParam } = await searchParams
  const view = viewParam === "grid" ? "grid" : "list"
  const provider = getDataProvider()
  const labelFor = await getTaxonomyLabeler(["makes"])
  const validStatuses: ListingStatus[] = [
    "AVAILABLE",
    "RESERVED",
    "SOLD",
    "RENTED",
  ]
  const statusFilter = validStatuses.includes(status as ListingStatus)
    ? (status as ListingStatus)
    : undefined

  const [listings, businessSpace] = await Promise.all([
    provider.getListings(user.businessSpaceId, {
      search: q,
      status: statusFilter,
    }),
    provider.getBusinessSpace(user.businessSpaceId),
  ])

  if (!businessSpace) return null

  return (
    <div className="space-y-6">
      <PageHeader
        title="Listings"
        description="Manage your vehicle inventory and listing status."
        actions={
          <Button asChild>
            <Link href={ROUTES.listingNew}>
              <Plus className="h-4 w-4" />
              Add Listing
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ListingSearch
          defaultQuery={q}
          defaultStatus={status}
          view={view}
          nature={businessSpace.nature}
        />
        <ListingViewToggle view={view} query={q} status={status} />
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Car className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">No listings found</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {q || status
              ? "Try adjusting your filters."
              : "Add your first vehicle listing to get started."}
          </p>
          {!q && !status && (
            <Button asChild className="mt-4">
              <Link href={ROUTES.listingNew}>Add Listing</Link>
            </Button>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <article key={listing.id} className="bg-card overflow-hidden rounded-lg border">
              <Link href={ROUTES.listingDetail(listing.id)} className="block">
                <ListingImage
                  src={listingCoverUrl(listing.images)}
                  className="bg-muted h-48 w-full object-cover"
                />
              </Link>
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={ROUTES.listingDetail(listing.id)}
                      className="font-medium hover:underline"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      {labelFor("makes", listing.make)} {listing.model} · {listing.year}
                    </p>
                  </div>
                  <ListingStatusBadge status={listing.status} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {formatPriceLabel(businessSpace.nature, listing.price)}
                  </p>
                  <TableRowActions
                    viewHref={ROUTES.listingDetail(listing.id)}
                    editHref={ROUTES.listingEdit(listing.id)}
                    destructive={{
                      label: "Archive listing",
                      description: `Archive ${listing.title}? It will be hidden from your inventory.`,
                      confirmLabel: "Archive listing",
                      icon: <Archive className="h-4 w-4" />,
                      onConfirm: archiveListingAction.bind(null, listing.id),
                    }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <ListingImage
                        src={listingCoverUrl(listing.images)}
                        className="bg-muted h-12 w-16 rounded-md object-cover"
                      />
                      <div>
                        <Link
                          href={ROUTES.listingDetail(listing.id)}
                          className="text-primary font-medium hover:underline"
                        >
                          {listing.title}
                        </Link>
                        <p className="text-muted-foreground text-xs">
                          {labelFor("makes", listing.make)} {listing.model}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{listing.year}</TableCell>
                  <TableCell>
                    {formatPriceLabel(businessSpace.nature, listing.price)}
                  </TableCell>
                  <TableCell>
                    <ListingStatusBadge status={listing.status} />
                  </TableCell>
                  <TableCell>
                    <TableRowActions
                      viewHref={ROUTES.listingDetail(listing.id)}
                      editHref={ROUTES.listingEdit(listing.id)}
                      destructive={{
                        label: "Archive listing",
                        description: `Archive ${listing.title}? It will be hidden from your inventory.`,
                        confirmLabel: "Archive listing",
                        icon: <Archive className="h-4 w-4" />,
                        onConfirm: archiveListingAction.bind(null, listing.id),
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
