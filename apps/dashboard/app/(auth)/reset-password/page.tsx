import Link from "next/link"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@autocore/ui"
import { ArrowLeft } from "lucide-react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { isMockMode } from "@/lib/config"
import { ROUTES } from "@/lib/constants/routes"

export const dynamic = "force-dynamic"

interface ResetPasswordPageProps {
  searchParams: Promise<{ refreshToken?: string; error?: string; errorDescription?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { refreshToken, error, errorDescription } = await searchParams
  const ticket = !isMockMode() && !error ? refreshToken : undefined

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Choose a password</CardTitle>
        <CardDescription>
          {ticket
            ? "Set the password you will use to sign in to AutoCore."
            : (errorDescription ?? "This link is invalid or has expired. Request a new one.")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {ticket ? (
          <ResetPasswordForm ticket={ticket} />
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link href={ROUTES.forgotPassword}>
              <ArrowLeft className="h-4 w-4" />
              Request a new link
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
