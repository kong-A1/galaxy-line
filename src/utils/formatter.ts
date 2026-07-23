export function formatPrice(val: number | string): string {
  return Number(val).toLocaleString("en-US");
}
