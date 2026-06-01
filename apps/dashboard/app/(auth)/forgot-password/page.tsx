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
import { ROUTES } from "@/lib/constants/routes"

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Password reset is not available in prototype mode. Contact your
          Business Owner or platform admin when connected to the live backend.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
