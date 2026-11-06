import { Card, CardContent, PageHeader } from "@autocore/ui"
import { createSpaceAction } from "@/lib/actions/master"
import { SpaceForm } from "@/components/master/space-form"

export default function NewSpacePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="New Business Space"
        description="Creates the space and provisions its Business Owner account."
      />
      <Card>
        <CardContent className="pt-6">
          <SpaceForm mode="create" onSubmit={createSpaceAction} />
        </CardContent>
      </Card>
    </div>
  )
}
