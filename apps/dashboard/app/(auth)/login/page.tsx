import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@autocore/ui"
import { Car } from "lucide-react"
import { signIn } from "@/lib/actions/auth"
import { MOCK_LOGIN_OPTIONS } from "@/lib/mock/fixtures/users"

export default function LoginPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="bg-primary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
          <Car className="text-primary-foreground h-6 w-6" />
        </div>
        <CardTitle className="text-2xl">AutoCore</CardTitle>
        <CardDescription>
          Sign in to your Business Space. Select a demo account below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {MOCK_LOGIN_OPTIONS.map((option) => (
          <form key={option.id} action={signIn.bind(null, option.id)}>
            <Button type="submit" variant="outline" className="h-auto w-full py-3">
              {option.label}
            </Button>
          </form>
        ))}
        <p className="text-muted-foreground pt-2 text-center text-xs">
          Prototype mode — mock authentication only
        </p>
      </CardContent>
    </Card>
  )
}
