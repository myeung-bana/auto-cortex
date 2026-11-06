export const ROUTES = {
  login: "/login",
  masterLogin: "/master-console/login",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/",
  clients: "/clients",
  clientNew: "/clients/new",
  clientDetail: (id: string) => `/clients/${id}`,
  clientEdit: (id: string) => `/clients/${id}/edit`,
  listings: "/listings",
  listingNew: "/listings/new",
  listingDetail: (id: string) => `/listings/${id}`,
  listingEdit: (id: string) => `/listings/${id}/edit/details`,
  listingEditSection: (
    id: string,
    section: "gallery" | "pricing" | "details" | "features"
  ) => `/listings/${id}/edit/${section}`,
  settings: "/settings",
  userManagement: "/user-management",
  masterConsole: "/master-console",
  masterSpaces: "/master-console/spaces",
  masterSpaceNew: "/master-console/spaces/new",
  masterSpaceEdit: (id: string) => `/master-console/spaces/${id}/edit`,
} as const

export const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: "LayoutDashboard" },
  { label: "Clients", href: ROUTES.clients, icon: "Users" },
  { label: "Listings", href: ROUTES.listings, icon: "Car" },
  { label: "User Management", href: ROUTES.userManagement, icon: "UserCog" },
  { label: "Settings", href: ROUTES.settings, icon: "Settings" },
] as const
