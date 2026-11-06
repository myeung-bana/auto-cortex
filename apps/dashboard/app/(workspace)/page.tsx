import Link from "next/link"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
} from "@autocore/ui"
import {
  ArrowRight,
  Car,
  DollarSign,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react"
import { getDataProvider } from "@/lib/data"
import { getSessionUser } from "@/lib/session"
import { ROUTES } from "@/lib/constants/routes"
import { formatCurrency, formatRelativeTime } from "@autocore/utils"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { ListingsByStatus } from "@/components/dashboard/listings-by-status"
import { VerticalBanner } from "@/components/dashboard/vertical-banner"

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user) return null

  const provider = getDataProvider()
  const [businessSpace, stats, activity] = await Promise.all([
    provider.getBusinessSpace(user.businessSpaceId),
    provider.getDashboardStats(user.businessSpaceId),
    provider.getActivityEvents(user.businessSpaceId, 8),
  ])

  if (!businessSpace) return null

  const isDealer = businessSpace.nature === "SECOND_HAND_DEALER"

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user.displayName.split(" ")[0]}`}
        description={`Here's what's happening at ${businessSpace.name} today.`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={ROUTES.clientNew}>
                <UserPlus className="h-4 w-4" />
                Add Client
              </Link>
            </Button>
            <Button asChild>
              <Link href={ROUTES.listingNew}>
                <Car className="h-4 w-4" />
                Add Listing
              </Link>
            </Button>
          </div>
        }
      />

      <VerticalBanner businessSpace={businessSpace} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients"
          value={stats.totalClients}
          description={`+${stats.newClientsLast30Days} in last 30 days`}
          icon={<Users className="text-primary h-4 w-4" />}
        />
        <StatCard
          title="Total Listings"
          value={stats.totalListings}
          description={`${stats.listingsByStatus.AVAILABLE} available`}
          icon={<Car className="text-primary h-4 w-4" />}
        />
        <StatCard
          title="Seats Used"
          value={`${stats.seatsUsed} / ${stats.seatLimit}`}
          description="Team capacity"
          icon={<TrendingUp className="text-primary h-4 w-4" />}
        />
        {isDealer ? (
          <StatCard
            title="Sold This Month"
            value={stats.soldThisMonth ?? 0}
            description={`${stats.reservedCount ?? 0} reserved`}
            icon={<DollarSign className="text-primary h-4 w-4" />}
          />
        ) : (
          <StatCard
            title="Revenue MTD"
            value={formatCurrency(stats.revenueMtd)}
            description={`${stats.currentlyRented ?? 0} currently rented`}
            icon={<DollarSign className="text-primary h-4 w-4" />}
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ListingsByStatus
          stats={stats.listingsByStatus}
          nature={businessSpace.nature}
        />
        <RecentActivity events={activity} />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Quick Links</CardTitle>
            <CardDescription>Jump to common tasks</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <QuickLink
            href={ROUTES.clients}
            label="View all clients"
            count={stats.totalClients}
          />
          <QuickLink
            href={ROUTES.listings}
            label="Manage listings"
            count={stats.totalListings}
          />
          {user.role === "BUSINESS_OWNER" && (
            <QuickLink
              href={ROUTES.userManagement}
              label="User management"
              count={stats.seatsUsed}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </CardContent>
    </Card>
  )
}

function QuickLink({
  href,
  label,
  count,
}: {
  href: string
  label: string
  count: number
}) {
  return (
    <Link
      href={href}
      className="hover:bg-muted flex items-center justify-between rounded-lg border p-4 transition-colors"
    >
      <div>
        <p className="font-medium">{label}</p>
        <Badge variant="secondary" className="mt-1">
          {count}
        </Badge>
      </div>
      <ArrowRight className="text-muted-foreground h-4 w-4" />
    </Link>
  )
}
