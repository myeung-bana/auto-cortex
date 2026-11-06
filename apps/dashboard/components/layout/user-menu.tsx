"use client"

import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@autocore/ui"
import { LogOut, RefreshCw } from "lucide-react"
import { signOut, switchBusinessSpace } from "@/lib/actions/auth"
import { isMockMode } from "@/lib/config"
import { MOCK_LOGIN_OPTIONS } from "@/lib/mock/fixtures/users"
import type { BusinessSpace, User } from "@autocore/utils"
import { USER_ROLE_LABELS } from "@autocore/utils"

interface UserMenuProps {
  user: User
  businessSpace: BusinessSpace
}

export function UserMenu({ user, businessSpace }: UserMenuProps) {
  const initials = user.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const otherSpaces = isMockMode()
    ? MOCK_LOGIN_OPTIONS.filter((o) => o.id !== user.id)
    : []

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-auto w-full justify-start gap-3 px-2 py-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium">{user.displayName}</p>
            <p className="text-muted-foreground text-xs">
              {USER_ROLE_LABELS[user.role]}
            </p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div>
            <p className="font-medium">{user.displayName}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              {businessSpace.name}
            </p>
          </div>
        </DropdownMenuLabel>
        {otherSpaces.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
              Switch demo space
            </DropdownMenuLabel>
            {otherSpaces.map((option) => (
              <DropdownMenuItem
                key={option.id}
                onClick={() => switchBusinessSpace(option.id)}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {option.label}
              </DropdownMenuItem>
            ))}
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
