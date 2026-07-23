export function formatPrice(val: string): string {
  return Number(val).toLocaleString("en-US");
}
