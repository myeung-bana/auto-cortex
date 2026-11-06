import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Badge,
  Button,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@autocore/ui"
import { Ban, Pencil, Plus, Trash2 } from "lucide-react"
import { ConfirmAction } from "@/components/actions/confirm-action"
import { getSessionUser } from "@/lib/session"
import { getTaxonomyConfig } from "@/lib/taxonomies/registry"
import { displayName, listTaxonomyRows } from "@/lib/taxonomies/provider"
import { removeTaxonomyAction } from "@/lib/actions/taxonomies"
import type { TaxonomyRecord } from "@/lib/taxonomies/types"

interface TaxonomyListPageProps {
  params: Promise<{ taxonomy: string }>
}

export default async function TaxonomyListPage({
  params,
}: TaxonomyListPageProps) {
  const user = await getSessionUser()
  if (!user) return null

  const { taxonomy } = await params
  const config = getTaxonomyConfig(taxonomy)
  if (!config) notFound()

  const { rows, canManage } = await listTaxonomyRows(config.key)

  return (
    <div className="space-y-6">
      <PageHeader
        title={config.label}
        description={config.description}
        actions={
          canManage ? (
            <Button asChild>
              <Link href={`/taxonomies/${config.key}/new`}>
                <Plus className="h-4 w-4" />
                Add
              </Link>
            </Button>
          ) : undefined
        }
      />

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              {config.kind === "range" && <TableHead>Range</TableHead>}
              <TableHead>Sort</TableHead>
              {config.kind === "named" && <TableHead>Status</TableHead>}
              <TableHead>Used by</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ record, usage, editable }) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {record.kind === "named" && record.hex && (
                        <span
                          className="h-4 w-4 rounded-full border"
                          style={{ backgroundColor: record.hex }}
                        />
                      )}
                      {editable ? (
                        <Link
                          href={`/taxonomies/${config.key}/${record.id}/edit`}
                          className="text-primary font-medium hover:underline"
                        >
                          {displayName(record)}
                        </Link>
                      ) : (
                        <span className="font-medium">{displayName(record)}</span>
                      )}
                    </div>
                    {record.kind === "named" && record.name["zh-Hant"] && (
                      <p className="text-muted-foreground text-xs">
                        {record.name["zh-Hant"]}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {record.slug}
                  </TableCell>
                  {config.kind === "range" && (
                    <TableCell>{rangeLabel(record)}</TableCell>
                  )}
                  <TableCell>{record.sortOrder}</TableCell>
                  {config.kind === "named" && (
                    <TableCell>
                      <Badge variant={record.kind === "named" && record.isActive ? "secondary" : "outline"}>
                        {record.kind === "named" && record.isActive
                          ? "Active"
                          : "Inactive"}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell>{usage}</TableCell>
                  <TableCell>
                    {!editable ? (
                      <div className="flex justify-end">
                        <Badge variant="outline">Shared</Badge>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-1">
                        <Button asChild variant="ghost" size="icon">
                          <Link
                            href={`/taxonomies/${config.key}/${record.id}/edit`}
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <ConfirmAction
                          label={
                            usage > 0 && record.kind === "named"
                              ? "Deactivate term"
                              : "Delete term"
                          }
                          description={
                            usage > 0 && record.kind === "named"
                              ? `${displayName(record)} is used by ${usage} listing${usage === 1 ? "" : "s"}. Deactivating hides it from new listings.`
                              : `Delete ${displayName(record)}? This removes it from the catalogue.`
                          }
                          confirmLabel={
                            usage > 0 && record.kind === "named"
                              ? "Deactivate"
                              : "Delete"
                          }
                          icon={
                            usage > 0 && record.kind === "named" ? (
                              <Ban className="h-4 w-4" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )
                          }
                          onConfirm={removeTaxonomyAction.bind(
                            null,
                            config.key,
                            record.id
                          )}
                        />
                      </div>
                    )}
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function rangeLabel(record: TaxonomyRecord) {
  if (record.kind !== "range") return "—"
  if (record.minCc != null || record.maxCc != null) {
    return `${record.minCc ?? 0}–${record.maxCc ?? "∞"} ${record.unit ?? "cc"}`
  }
  const currency = record.currency ?? ""
  return `${currency} ${record.min ?? 0}–${record.max ?? "∞"}`
}
