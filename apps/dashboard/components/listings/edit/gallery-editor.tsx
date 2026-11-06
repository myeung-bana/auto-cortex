"use client"

import { useState } from "react"
import { Button, Input, Label } from "@autocore/ui"
import { toast } from "sonner"
import type { ListingImage } from "@autocore/utils"
import { saveListingGalleryAction } from "@/lib/actions/listings"

export function GalleryEditor({
  listingId,
  images,
}: {
  listingId: string
  images: ListingImage[]
}) {
  const [items, setItems] = useState(images)
  const [url, setUrl] = useState("")
  const [pending, setPending] = useState(false)

  function setCover(index: number) {
    setItems((current) =>
      current.map((image, imageIndex) => ({
        ...image,
        isCover: imageIndex === index,
      }))
    )
  }

  function remove(index: number) {
    setItems((current) => {
      const next = current.filter((_, imageIndex) => imageIndex !== index)
      if (next.length > 0 && !next.some((image) => image.isCover)) {
        next[0] = { ...next[0], isCover: true }
      }
      return next.map((image, imageIndex) => ({ ...image, position: imageIndex }))
    })
  }

  function addImage() {
    const sourceUrl = url.trim()
    if (!sourceUrl) return
    setItems((current) => [
      ...current,
      {
        position: current.length,
        isCover: current.length === 0,
        storageFileId: null,
        sourceUrl,
      },
    ])
    setUrl("")
  }

  async function save() {
    setPending(true)
    try {
      await saveListingGalleryAction(
        listingId,
        items.map((image, index) => ({ ...image, position: index }))
      )
      toast.success("Gallery saved")
    } catch {
      toast.error("Failed to save gallery")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">No images yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((image, index) => (
            <div key={`${image.sourceUrl}-${index}`} className="bg-muted overflow-hidden rounded-lg border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.sourceUrl}
                alt=""
                className="h-40 w-full object-cover"
              />
              <div className="flex items-center justify-between gap-2 p-3">
                <span className="text-xs font-medium">
                  {image.isCover ? "Cover" : `Image ${index + 1}`}
                </span>
                <div className="flex gap-2">
                  {!image.isCover && (
                    <Button type="button" size="sm" variant="outline" onClick={() => setCover(index)}>
                      Set cover
                    </Button>
                  )}
                  <Button type="button" size="sm" variant="ghost" onClick={() => remove(index)}>
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1 space-y-2">
          <Label htmlFor="image-url">Image URL</Label>
          <Input
            id="image-url"
            placeholder="https://"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
        <Button type="button" variant="outline" className="sm:mt-8" onClick={addImage}>
          Add image
        </Button>
      </div>

      <Button type="button" onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save gallery"}
      </Button>
    </div>
  )
}
