import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope } from 'vue'

import { useCountdown } from '../useCountdown'

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is idle until started', () => {
    const scope = effectScope()
    const { remaining, isRunning } = scope.run(() => useCountdown(45))!

    expect(remaining.value).toBe(0)
    expect(isRunning.value).toBe(false)
    scope.stop()
  })

  it('counts down in whole seconds and stops at 0', () => {
    const scope = effectScope()
    const { remaining, isRunning, start } = scope.run(() => useCountdown(45))!

    start()
    expect(remaining.value).toBe(45)
    expect(isRunning.value).toBe(true)

    vi.advanceTimersByTime(10_000)
    expect(remaining.value).toBe(35)

    vi.advanceTimersByTime(35_000)
    expect(remaining.value).toBe(0)
    expect(isRunning.value).toBe(false)
    scope.stop()
  })

  it('restarts from the full time', () => {
    const scope = effectScope()
    const { remaining, start } = scope.run(() => useCountdown(45))!

    start()
    vi.advanceTimersByTime(45_000)
    expect(remaining.value).toBe(0)

    start()
    expect(remaining.value).toBe(45)
    scope.stop()
  })

  it('stops ticking when its scope is disposed', () => {
    const scope = effectScope()
    const { remaining, start } = scope.run(() => useCountdown(45))!

    start()
    scope.stop()
    vi.advanceTimersByTime(20_000)

    expect(remaining.value).toBe(45)
  })
})
