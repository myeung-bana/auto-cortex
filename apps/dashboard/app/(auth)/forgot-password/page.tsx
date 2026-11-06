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
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { isMockMode } from "@/lib/config"
import { ROUTES } from "@/lib/constants/routes"

export default function ForgotPasswordPage() {
  const mock = isMockMode()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          {mock
            ? "Password reset is not available in prototype mode. Contact your Business Owner or platform admin when connected to the live backend."
            : "Enter your account email and we will send you a link to choose a new password."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!mock && <ForgotPasswordForm />}
        <Button asChild variant="outline" className="w-full">
          <Link href={ROUTES.login}>
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
