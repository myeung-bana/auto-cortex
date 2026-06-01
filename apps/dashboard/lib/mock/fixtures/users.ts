import type { User } from "@autocore/utils"

export const USERS: User[] = [
  {
    id: "user-vins-owner",
    businessSpaceId: "vins-motors",
    role: "BUSINESS_OWNER",
    displayName: "Vincent Chen",
    email: "vincent@vinsmotors.com",
    isActive: true,
    createdAt: "2025-11-01T10:00:00Z",
  },
  {
    id: "user-vins-staff",
    businessSpaceId: "vins-motors",
    role: "USER",
    displayName: "Sarah Mitchell",
    email: "sarah@vinsmotors.com",
    isActive: true,
    createdAt: "2025-11-15T09:00:00Z",
  },
  {
    id: "user-vins-staff-2",
    businessSpaceId: "vins-motors",
    role: "USER",
    displayName: "James Park",
    email: "james@vinsmotors.com",
    isActive: true,
    createdAt: "2025-12-01T11:00:00Z",
  },
  {
    id: "user-prestige-owner",
    businessSpaceId: "prestige-rentals",
    role: "BUSINESS_OWNER",
    displayName: "Elena Rodriguez",
    email: "elena@prestigerentals.com",
    isActive: true,
    createdAt: "2025-09-15T08:00:00Z",
  },
  {
    id: "user-prestige-staff",
    businessSpaceId: "prestige-rentals",
    role: "USER",
    displayName: "Marcus Webb",
    email: "marcus@prestigerentals.com",
    isActive: true,
    createdAt: "2025-10-01T14:00:00Z",
  },
]

export const MOCK_LOGIN_OPTIONS = [
  {
    id: "user-vins-owner",
    label: "Vincent Chen — Vins Motors (Owner)",
  },
  {
    id: "user-vins-staff",
    label: "Sarah Mitchell — Vins Motors (Staff)",
  },
  {
    id: "user-prestige-owner",
    label: "Elena Rodriguez — Prestige Rentals (Owner)",
  },
  {
    id: "user-prestige-staff",
    label: "Marcus Webb — Prestige Rentals (Staff)",
  },
]
