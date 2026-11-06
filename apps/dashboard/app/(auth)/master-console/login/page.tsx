import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@autocore/ui"
import { ShieldCheck } from "lucide-react"
import { DemoAccounts } from "@/components/auth/demo-accounts"
import { LoginForm } from "@/components/auth/login-form"
import { PortalToggle } from "@/components/auth/portal-toggle"
import { signInMaster } from "@/lib/actions/auth"
import { isMockMode } from "@/lib/config"

export const dynamic = "force-dynamic"

export default function MasterLoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-4 text-center">
        <PortalToggle portal="master" />
        <div>
          <div className="bg-secondary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
            <ShieldCheck className="text-secondary-foreground h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Master Console</CardTitle>
          <CardDescription>
            Sign in as a platform admin. Business Space accounts cannot use this portal.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginForm portal="master" />
        {isMockMode() && (
          <DemoAccounts>
            <form action={signInMaster}>
              <Button type="submit" variant="secondary" className="h-auto w-full py-3">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Platform Super Admin
              </Button>
            </form>
          </DemoAccounts>
        )}
      </CardContent>
    </Card>
  )
}
