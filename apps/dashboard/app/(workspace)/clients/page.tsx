import Link from "next/link"
import {
  Button,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@autocore/ui"
import { Plus, User } from "lucide-react"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session/mock-session"
import { ROUTES } from "@/lib/constants/routes"
import { formatDate } from "@autocore/utils"
import { ClientSearch } from "@/components/clients/client-search"

interface ClientsPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const user = await getSessionUser()
  if (!user) return null

  const { q } = await searchParams
  const provider = getDataProvider()
  const clients = await provider.getClients(user.businessSpaceId, {
    search: q,
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients"
        description="Manage your customer records and contact information."
        actions={
          <Button asChild>
            <Link href={ROUTES.clientNew}>
              <Plus className="h-4 w-4" />
              Add Client
            </Link>
          </Button>
        }
      />

      <ClientSearch defaultValue={q} />

      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <User className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-lg font-semibold">No clients found</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {q ? "Try a different search term." : "Get started by adding your first client."}
          </p>
          {!q && (
            <Button asChild className="mt-4">
              <Link href={ROUTES.clientNew}>Add Client</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Link
                      href={ROUTES.clientDetail(client.id)}
                      className="text-primary font-medium hover:underline"
                    >
                      {client.fullName}
                    </Link>
                  </TableCell>
                  <TableCell>{client.email ?? "—"}</TableCell>
                  <TableCell>{client.phone ?? "—"}</TableCell>
                  <TableCell>{formatDate(client.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
