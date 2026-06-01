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
import { Car, Plus } from "lucide-react"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session/mock-session"
import { ROUTES } from "@/lib/constants/routes"
import { formatPriceLabel, type ListingStatus } from "@autocore/utils"
import { ListingStatusBadge } from "@/components/listings/listing-status-badge"
import { ListingSearch } from "@/components/listings/listing-search"

interface ListingsPageProps {
  searchParams: Promise<{ q?: string; status?: string }>
}

export default async function ListingsPage({
  searchParams,
}: ListingsPageProps) {
  const user = await getSessionUser()
  if (!user) return null

  const { q, status } = await searchParams
  const provider = getDataProvider()
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

      <ListingSearch
        defaultQuery={q}
        defaultStatus={status}
        nature={businessSpace.nature}
      />

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
      ) : (
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell>
                    <Link
                      href={ROUTES.listingDetail(listing.id)}
                      className="text-primary font-medium hover:underline"
                    >
                      {listing.title}
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      {listing.make} {listing.model}
                    </p>
                  </TableCell>
                  <TableCell>{listing.year}</TableCell>
                  <TableCell>
                    {formatPriceLabel(businessSpace.nature, listing.price)}
                  </TableCell>
                  <TableCell>
                    <ListingStatusBadge status={listing.status} />
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
