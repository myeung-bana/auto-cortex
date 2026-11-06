import { notFound } from "next/navigation"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session"
import { PricingForm } from "@/components/listings/edit/pricing-form"

export default async function PricingPage({
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
        <h2 className="text-lg font-semibold">Pricing</h2>
        <p className="text-muted-foreground text-sm">
          Set the asking price and currency for this listing.
        </p>
      </div>
      <PricingForm
        listingId={listing.id}
        amount={listing.price?.amount ?? null}
        currency={listing.price?.currency ?? "HKD"}
      />
    </section>
  )
}
