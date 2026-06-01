import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/session/mock-session"
import { ROUTES } from "@/lib/constants/routes"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  if (user) redirect(ROUTES.dashboard)

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      {children}
    </div>
  )
}
