export function formatCurrency(
  amount: number | null | undefined,
  currency = "USD"
): string {
  if (amount == null) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPriceLabel(
  nature: "SECOND_HAND_DEALER" | "LUXURY_CAR_RENTAL",
  amount: number | null | undefined
): string {
  if (amount == null) return "—"
  const formatted = formatCurrency(amount)
  return nature === "LUXURY_CAR_RENTAL" ? `${formatted}/day` : formatted
}
