import { describe, expect, it } from 'vitest'

import { getSafeRedirect } from '../redirect'

describe('getSafeRedirect', () => {
  it('keeps same-site paths with query and hash', () => {
    expect(getSafeRedirect('/app/points?tab=1#top', '/')).toBe('/app/points?tab=1#top')
  })

  it('uses the first value when the query param is repeated', () => {
    expect(getSafeRedirect(['/app', '/auth'], '/')).toBe('/app')
  })

  it.each([
    undefined,
    null,
    '',
    'app',
    'https://evil.example',
    '//evil.example',
    '/\\evil.example',
  ])('falls back for %s', (value) => {
    expect(getSafeRedirect(value, '/home')).toBe('/home')
  })

  it('never redirects to an excluded path, with or without a query', () => {
    expect(getSafeRedirect('/maintenance', '/', ['/maintenance'])).toBe('/')
    expect(getSafeRedirect('/maintenance?redirect=%2Fapp', '/', ['/maintenance'])).toBe('/')
  })

  it('does not exclude paths that only share a prefix', () => {
    expect(getSafeRedirect('/maintenance-guide', '/', ['/maintenance'])).toBe('/maintenance-guide')
  })
})
