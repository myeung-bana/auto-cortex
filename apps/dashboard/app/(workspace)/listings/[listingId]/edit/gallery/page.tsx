import { notFound } from "next/navigation"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session"
import { GalleryEditor } from "@/components/listings/edit/gallery-editor"

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ listingId: string }>
}) {
  const user = await getSessionUser()
  if (!user) return null
  const { listingId } = await params
  const listing = await getDataProvider().getListing(user.businessSpaceId, listingId)
  if (!listing) notFound()

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Gallery images</h2>
        <p className="text-muted-foreground text-sm">
          Add photos, choose a cover, or remove images.
        </p>
      </div>
      <GalleryEditor listingId={listing.id} images={listing.images} />
    </section>
  )
}
