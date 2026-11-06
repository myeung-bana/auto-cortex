import Link from "next/link"
import { notFound } from "next/navigation"
import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@autocore/ui"
import { ArrowLeft } from "lucide-react"
import { getTaxonomyConfig } from "@/lib/taxonomies/registry"
import { getSessionUser } from "@/lib/session"
import { getTaxonomyRecord } from "@/lib/taxonomies/provider"
import { TaxonomyForm } from "@/components/taxonomies/taxonomy-form"
import { updateTaxonomyAction } from "@/lib/actions/taxonomies"
import type { TaxonomyInput, TaxonomyRecord } from "@/lib/taxonomies/types"

interface EditTaxonomyPageProps {
  params: Promise<{ taxonomy: string; id: string }>
}

export default async function EditTaxonomyPage({
  params,
}: EditTaxonomyPageProps) {
  if (!(await getSessionUser())) return null
  const { taxonomy, id } = await params
  const config = getTaxonomyConfig(taxonomy)
  if (!config) notFound()
  const record = await getTaxonomyRecord(config.key, id)
  if (!record) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit term"
        description={config.label}
        actions={
          <Button asChild variant="outline">
            <Link href={`/taxonomies/${config.key}`}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaxonomyForm
            config={config}
            defaultValues={toInput(record)}
            onSubmit={updateTaxonomyAction.bind(null, config.key, id)}
            submitLabel="Save changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}

function toInput(record: TaxonomyRecord): TaxonomyInput {
  if (record.kind === "named") {
    return {
      nameEn: record.name.en,
      nameZh: record.name["zh-Hant"] ?? "",
      slug: record.slug,
      sortOrder: record.sortOrder,
      isActive: record.isActive,
      country: record.country ?? "",
      logoUrl: record.logoUrl ?? "",
      hex: record.hex ?? "",
      icon: record.icon ?? "",
      category: record.category ?? "safety",
      isElectric: record.isElectric ?? false,
      requiresEngineSize: record.requiresEngineSize ?? false,
    }
  }

  return {
    nameEn: record.label.en,
    nameZh: record.label["zh-Hant"] ?? "",
    slug: record.slug,
    sortOrder: record.sortOrder,
    currency: record.currency ?? "HKD",
    unit: record.unit ?? "cc",
    min: record.min,
    max: record.max,
    minCc: record.minCc,
    maxCc: record.maxCc,
  }
}
