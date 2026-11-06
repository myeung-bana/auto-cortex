"use client"

import { useState } from "react"
import { LISTING_FALLBACK_IMAGE } from "@/lib/listings/cover-image"

export function ListingImage({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  const [current, setCurrent] = useState(src)

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt=""
      className={className}
      onError={() => {
        if (current !== LISTING_FALLBACK_IMAGE) {
          setCurrent(LISTING_FALLBACK_IMAGE)
        }
      }}
    />
  )
}
