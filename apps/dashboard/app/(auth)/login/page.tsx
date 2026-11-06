import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@autocore/ui"
import { Car } from "lucide-react"
import { DemoAccounts } from "@/components/auth/demo-accounts"
import { LoginForm } from "@/components/auth/login-form"
import { PortalToggle } from "@/components/auth/portal-toggle"
import { signIn } from "@/lib/actions/auth"
import { isMockMode } from "@/lib/config"
import { getLoginOptions } from "@/lib/session/mock-session"

export const dynamic = "force-dynamic"

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-4 text-center">
        <PortalToggle portal="workspace" />
        <div>
          <div className="bg-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
            <Car className="text-primary-foreground h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">AutoCore</CardTitle>
          <CardDescription>
            Sign in to your Business Space with your work email and password.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginForm portal="workspace" />
        {isMockMode() && <MockWorkspaceSignIn />}
      </CardContent>
    </Card>
  )
}

function MockWorkspaceSignIn() {
  return (
    <DemoAccounts>
      {getLoginOptions().map((option) => (
        <form key={option.id} action={signIn.bind(null, option.id)}>
          <Button type="submit" variant="outline" className="h-auto w-full py-3">
            {option.label}
          </Button>
        </form>
      ))}
    </DemoAccounts>
  )
}
