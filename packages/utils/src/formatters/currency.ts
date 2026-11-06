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
  price: number | { amount: number; currency?: string } | null | undefined
): string {
  if (price == null) return "—"
  const amount = typeof price === "number" ? price : price.amount
  const currency = typeof price === "number" ? "HKD" : price.currency ?? "HKD"
  const formatted = formatCurrency(amount, currency)
  return nature === "LUXURY_CAR_RENTAL" ? `${formatted}/day` : formatted
}
