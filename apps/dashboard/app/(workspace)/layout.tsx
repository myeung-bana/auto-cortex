import { redirect } from "next/navigation"
import { getDataProvider } from "@/lib/data"
import { ROUTES } from "@/lib/constants/routes"
import { getSessionUser } from "@/lib/session/mock-session"
import { AppSidebar } from "@/components/layout/app-sidebar"

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getSessionUser()
  if (!user) redirect(ROUTES.login)

  const provider = getDataProvider()
  const businessSpace = await provider.getBusinessSpace(user.businessSpaceId)
  if (!businessSpace) redirect(ROUTES.login)

  return (
    <div className="flex min-h-screen">
      <AppSidebar user={user} businessSpace={businessSpace} />
      <main className="bg-background flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
