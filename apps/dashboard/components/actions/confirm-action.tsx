"use client"

import { useState } from "react"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@autocore/ui"
import { toast } from "sonner"

interface ConfirmActionProps {
  label: string
  description: string
  confirmLabel: string
  icon: React.ReactNode
  onConfirm: () => void | Promise<void>
}

export function ConfirmAction({
  label,
  description,
  confirmLabel,
  icon,
  onConfirm,
}: ConfirmActionProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [pending, setPending] = useState(false)

  function close() {
    setOpen(false)
    setStep(1)
    setPending(false)
  }

  async function confirm() {
    setPending(true)
    try {
      await onConfirm()
      close()
    } catch (error) {
      if (isRedirect(error)) throw error
      toast.error("The action could not be completed")
      setPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setOpen(true)
        else close()
      }}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={label}
        onClick={() => setOpen(true)}
      >
        {icon}
      </Button>
      <DialogContent>
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle>{label}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button type="button" onClick={() => setStep(2)}>
                Continue
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Confirm again</DialogTitle>
              <DialogDescription>
                This is the final step. {description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={pending}
                onClick={confirm}
              >
                {pending ? "Working..." : confirmLabel}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function isRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  )
}
