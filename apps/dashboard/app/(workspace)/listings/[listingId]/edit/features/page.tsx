import { notFound } from "next/navigation"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session"
import { getActiveOptions } from "@/lib/taxonomies/provider"
import { FeaturesForm } from "@/components/listings/edit/features-form"

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ listingId: string }>
}) {
  const user = await getSessionUser()
  if (!user) return null
  const { listingId } = await params
  const [listing, features] = await Promise.all([
    getDataProvider().getListing(user.businessSpaceId, listingId),
    getActiveOptions("features"),
  ])
  if (!listing) notFound()

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Listing features</h2>
        <p className="text-muted-foreground text-sm">
          Equipment such as sunroof, leather seats, and safety systems.
        </p>
      </div>
      <FeaturesForm
        listingId={listing.id}
        selected={listing.features}
        features={features}
      />
    </section>
  )
}
