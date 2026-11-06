import { notFound } from "next/navigation"
import { Card, CardContent, PageHeader } from "@autocore/ui"
import { updateSpaceAction } from "@/lib/actions/master"
import { getSpace } from "@/lib/master/provider"
import { getMasterSession } from "@/lib/session"
import { SpaceForm } from "@/components/master/space-form"

export default async function EditSpacePage({
  params,
}: {
  params: Promise<{ spaceId: string }>
}) {
  if (!(await getMasterSession())) return null
  const { spaceId } = await params
  const space = await getSpace(spaceId)
  if (!space) notFound()

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title={`Edit ${space.name}`}
        description={`${space.seatsUsed} of ${space.seatLimit} seats in use.`}
      />
      <Card>
        <CardContent className="pt-6">
          <SpaceForm
            mode="edit"
            defaultValues={{
              name: space.name,
              nature: space.nature,
              seatLimit: space.seatLimit,
            }}
            onSubmit={updateSpaceAction.bind(null, space.id)}
          />
        </CardContent>
      </Card>
    </div>
  )
}
