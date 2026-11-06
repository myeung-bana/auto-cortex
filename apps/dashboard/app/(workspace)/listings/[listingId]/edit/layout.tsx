import Link from "next/link"
import { notFound } from "next/navigation"
import { Button, PageHeader } from "@autocore/ui"
import { ArrowLeft } from "lucide-react"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session"
import { ROUTES } from "@/lib/constants/routes"
import { ListingEditNav } from "@/components/listings/edit/section-nav"

export default async function EditListingLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ listingId: string }>
}) {
  const user = await getSessionUser()
  if (!user) return null

  const { listingId } = await params
  const listing = await getDataProvider().getListing(user.businessSpaceId, listingId)
  if (!listing || listing.isArchived) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit listing"
        description={listing.title}
        actions={
          <Button asChild variant="outline">
            <Link href={ROUTES.listingDetail(listing.id)}>
              <ArrowLeft className="h-4 w-4" />
              Back to listing
            </Link>
          </Button>
        }
      />
      <ListingEditNav listingId={listing.id} />
      <div className="bg-card max-w-4xl rounded-lg border p-6">{children}</div>
    </div>
  )
}
