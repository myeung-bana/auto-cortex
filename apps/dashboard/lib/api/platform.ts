import "server-only"
import type { CreateSpaceInput, PlatformSpace, SpaceInput } from "../master/types"
import type { PlatformEvent } from "../master/types"
import { callFunction } from "./http"

export interface PlatformOverview {
  stats: {
    activeSpaces: number
    suspendedSpaces: number
    totalUsers: number
    totalListings: number
  }
  events: PlatformEvent[]
}

export const platformApi = {
  me: () =>
    callFunction<{ id: string; displayName: string; email: string }>("platform-overview", "me"),
  overview: (eventLimit = 10) =>
    callFunction<PlatformOverview>("platform-overview", "get", { eventLimit }),

  spaces: {
    list: () => callFunction<PlatformSpace[]>("platform-spaces", "list"),
    get: (id: string) => callFunction<PlatformSpace | null>("platform-spaces", "get", { id }),
    create: (input: CreateSpaceInput) =>
      callFunction<{ space: PlatformSpace | null; inviteSent: boolean }>(
        "platform-spaces",
        "create",
        { input }
      ),
    update: (id: string, input: SpaceInput) =>
      callFunction<PlatformSpace | null>("platform-spaces", "update", { id, input }),
    setActive: (id: string, isActive: boolean) =>
      callFunction<boolean>("platform-spaces", "setActive", { id, isActive }),
    delete: (id: string) => callFunction<boolean>("platform-spaces", "delete", { id }),
  },
}
