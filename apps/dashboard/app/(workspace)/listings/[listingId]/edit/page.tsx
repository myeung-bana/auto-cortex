import { redirect } from "next/navigation"
import { ROUTES } from "@/lib/constants/routes"

export default async function EditListingIndexPage({
  params,
}: {
  params: Promise<{ listingId: string }>
}) {
  const { listingId } = await params
  redirect(ROUTES.listingEditSection(listingId, "details"))
}
