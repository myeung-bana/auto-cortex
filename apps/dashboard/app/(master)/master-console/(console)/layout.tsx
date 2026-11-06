import { redirect } from "next/navigation"
import { ROUTES } from "@/lib/constants/routes"
import { getMasterSession, getSessionUser } from "@/lib/session"
import { MasterSidebar } from "@/components/master/master-sidebar"

export const dynamic = "force-dynamic"

export default async function MasterConsoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await getMasterSession()
  if (!admin) {
    // Tenant accounts belong in the Business Space dashboard.
    if (await getSessionUser()) redirect(ROUTES.dashboard)
    redirect(ROUTES.masterLogin)
  }

  return (
    <div className="flex min-h-screen">
      <MasterSidebar adminName={admin.displayName} />
      <main className="bg-background flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
