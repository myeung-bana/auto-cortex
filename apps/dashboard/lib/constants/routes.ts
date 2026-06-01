export const ROUTES = {
  login: "/login",
  forgotPassword: "/forgot-password",
  dashboard: "/",
  clients: "/clients",
  clientNew: "/clients/new",
  clientDetail: (id: string) => `/clients/${id}`,
  clientEdit: (id: string) => `/clients/${id}/edit`,
  listings: "/listings",
  listingNew: "/listings/new",
  listingDetail: (id: string) => `/listings/${id}`,
  listingEdit: (id: string) => `/listings/${id}/edit`,
  settings: "/settings",
  settingsUsers: "/settings/users",
} as const

export const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: "LayoutDashboard" },
  { label: "Clients", href: ROUTES.clients, icon: "Users" },
  { label: "Listings", href: ROUTES.listings, icon: "Car" },
  { label: "Settings", href: ROUTES.settings, icon: "Settings" },
] as const
