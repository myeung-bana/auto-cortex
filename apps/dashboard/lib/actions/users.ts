"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { workspaceApi } from "../api/workspace"
import { errorMessage } from "../api/errors"
import { isMockMode } from "../config"
import { ROUTES } from "../constants/routes"
import { getSessionUser } from "../session"

export interface InviteResult {
  error?: string
  notice?: string
}

export async function inviteUserAction(input: {
  email: string
  displayName: string
}): Promise<InviteResult> {
  const user = await getSessionUser()
  if (!user) redirect(ROUTES.login)
  if (user.role !== "BUSINESS_OWNER") {
    return { error: "Only the business owner can invite users" }
  }
  if (isMockMode()) {
    return { notice: "User invitations will be available when connected to the backend." }
  }

  try {
    const { inviteSent } = await workspaceApi.users.invite(input)
    revalidatePath(ROUTES.userManagement)
    revalidatePath(ROUTES.settings)
    return {
      notice: inviteSent
        ? `Invitation sent to ${input.email}`
        : `${input.email} was added, but the invitation email failed. They can use "Forgot password" to set one.`,
    }
  } catch (error) {
    return { error: errorMessage(error, "The invitation could not be sent") }
  }
}
