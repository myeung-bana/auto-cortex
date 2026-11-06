import { notFound } from "next/navigation"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session"
import { getListingFormOptions } from "@/lib/taxonomies/provider"
import { DetailsForm } from "@/components/listings/edit/details-form"

export default async function DetailsPage({
  params,
}: {
  params: Promise<{ listingId: string }>
}) {
  const user = await getSessionUser()
  if (!user) return null
  const { listingId } = await params
  const [listing, options] = await Promise.all([
    getDataProvider().getListing(user.businessSpaceId, listingId),
    getListingFormOptions(),
  ])
  if (!listing) notFound()

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Listing details</h2>
        <p className="text-muted-foreground text-sm">
          Year, mileage, drivetrain, colours, seats, and doors.
        </p>
      </div>
      <DetailsForm
        listingId={listing.id}
        makes={options.makes}
        bodyTypes={options.bodyTypes}
        transmissions={options.transmissions}
        fuelTypes={options.fuelTypes}
        exteriorColors={options.exteriorColors}
        interiorColors={options.interiorColors}
        values={{
          year: listing.year,
          mileage: listing.mileage?.value ?? null,
          transmission: listing.transmission ?? "",
          make: listing.make,
          bodyType: listing.bodyType ?? "",
          fuelType: listing.fuelType ?? "",
          engineCc: listing.engineCc,
          exteriorColor: listing.exteriorColor ?? "",
          interiorColor: listing.interiorColor ?? "",
          seats: listing.seats,
          doors: listing.doors,
        }}
      />
    </section>
  )
}
