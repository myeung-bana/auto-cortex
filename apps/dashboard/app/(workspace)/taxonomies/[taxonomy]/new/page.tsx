import Link from "next/link"
import { notFound } from "next/navigation"
import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader } from "@autocore/ui"
import { ArrowLeft } from "lucide-react"
import { getTaxonomyConfig } from "@/lib/taxonomies/registry"
import { TaxonomyForm } from "@/components/taxonomies/taxonomy-form"
import { saveTaxonomyAction } from "@/lib/actions/taxonomies"

interface NewTaxonomyPageProps {
  params: Promise<{ taxonomy: string }>
}

export default async function NewTaxonomyPage({ params }: NewTaxonomyPageProps) {
  const { taxonomy } = await params
  const config = getTaxonomyConfig(taxonomy)
  if (!config) notFound()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Add ${config.label.replace(/s$/, "").toLowerCase()}`}
        description={config.description}
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
            onSubmit={saveTaxonomyAction.bind(null, config.key)}
            submitLabel="Create"
          />
        </CardContent>
      </Card>
    </div>
  )
}
