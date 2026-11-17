import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { PDPA_STORAGE_KEY, PDPA_VERSION, usePdpaStore } from '../pdpa.store'

const stored = () => JSON.parse(localStorage.getItem(PDPA_STORAGE_KEY) ?? 'null')

describe('pdpa store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('asks when nothing was stored', () => {
    const store = usePdpaStore()

    expect(store.consent).toBeNull()
    expect(store.needsConsent).toBe(true)
  })

  it('remembers an acceptance with its version, time and the marketing choice', () => {
    usePdpaStore().accept(true, true, true, new Date('2026-11-05T10:00:00Z'))

    expect(stored()).toEqual({
      version: PDPA_VERSION,
      acceptedAt: '2026-11-05T10:00:00.000Z',
      terms: true,
      privacy: true,
      marketing: true,
    })

    // A fresh store (a later visit) reads it back
    setActivePinia(createPinia())
    const next = usePdpaStore()
    expect(next.needsConsent).toBe(false)
    expect(next.consent?.marketing).toBe(true)
  })

  it('treats marketing as declined unless it was ticked', () => {
    const store = usePdpaStore()
    store.accept()

    expect(store.consent?.marketing).toBe(false)
  })

  it('counts a consent stored before the marketing option existed as declined, not accepted', () => {
    localStorage.setItem(
      PDPA_STORAGE_KEY,
      JSON.stringify({ version: PDPA_VERSION, acceptedAt: 'x' }),
    )
    setActivePinia(createPinia())
    const store = usePdpaStore()

    expect(store.needsConsent).toBe(false)
    expect(store.consent?.marketing).toBe(false)
  })

  it('asks again when the terms have a newer version', () => {
    localStorage.setItem(
      PDPA_STORAGE_KEY,
      JSON.stringify({ version: '0.9', acceptedAt: 'x', marketing: true }),
    )
    setActivePinia(createPinia())

    expect(usePdpaStore().needsConsent).toBe(true)
  })

  it.each(['', 'not json', '{', 'null', '[]', '{"version":1}'])(
    'ignores corrupt data %j',
    (raw) => {
      localStorage.setItem(PDPA_STORAGE_KEY, raw)
      setActivePinia(createPinia())

      expect(usePdpaStore().needsConsent).toBe(true)
    },
  )

  it('accept() closes the prompt for everyone sharing the store', () => {
    const store = usePdpaStore()
    store.accept()

    expect(usePdpaStore().needsConsent).toBe(false)
  })

  it('still counts as accepted for this visit when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    setActivePinia(createPinia())

    const store = usePdpaStore()
    expect(store.needsConsent).toBe(true)

    expect(() => store.accept(true)).not.toThrow()
    expect(store.needsConsent).toBe(false)
    expect(store.consent?.marketing).toBe(true)
  })
})
