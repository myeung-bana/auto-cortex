import type { ListingImage } from "@autocore/utils"

export const LISTING_FALLBACK_IMAGE = "/images/listing-fallback.svg"

export function listingCoverUrl(images: ListingImage[]): string {
  if (images.length === 0) return LISTING_FALLBACK_IMAGE
  const cover = images.find((image) => image.isCover) ?? images[0]
  return cover.sourceUrl || LISTING_FALLBACK_IMAGE
}
