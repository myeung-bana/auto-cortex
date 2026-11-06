/** Prototype-only sign-in shortcuts shown under the standard form in mock mode. */
export function DemoAccounts({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-3 border-t pt-4">
      <div className="space-y-1 text-center">
        <p className="text-sm font-medium">Demo accounts</p>
        <p className="text-muted-foreground text-xs">
          Prototype mode: these skip Nhost. Signing in with a real account needs
          NEXT_PUBLIC_USE_MOCK_DATA=false.
        </p>
      </div>
      {children}
    </div>
  )
}
