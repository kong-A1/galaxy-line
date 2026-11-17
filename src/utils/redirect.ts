/**
 * Only same-site absolute paths are allowed, so a `?redirect=` value cannot send people to another site.
 * `excludedPrefixes` lists paths that must not be redirected to (e.g. the page the person is leaving, to avoid a loop).
 */
export function getSafeRedirect(
  value: unknown,
  fallback: string,
  excludedPrefixes: string[] = [],
): string {
  const target = Array.isArray(value) ? value[0] : value

  if (typeof target !== 'string') return fallback
  if (!target.startsWith('/') || target.startsWith('//') || target.startsWith('/\\'))
    return fallback
  if (excludedPrefixes.some((prefix) => target === prefix || target.startsWith(`${prefix}?`))) {
    return fallback
  }

  return target
}
