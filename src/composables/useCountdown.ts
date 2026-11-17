import { computed, onScopeDispose, ref } from 'vue'

/** Counts whole seconds down from `seconds`. Measured against the clock, so a throttled background tab does not drift. */
export function useCountdown(seconds: number) {
  const remaining = ref(0)
  let timer: ReturnType<typeof setInterval> | null = null
  let endsAt = 0

  function stop() {
    if (timer) clearInterval(timer)
    timer = null
  }

  function tick() {
    remaining.value = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))
    if (remaining.value === 0) stop()
  }

  function start() {
    stop()
    endsAt = Date.now() + seconds * 1000
    remaining.value = seconds
    timer = setInterval(tick, 250)
  }

  onScopeDispose(stop)

  return { remaining, isRunning: computed(() => remaining.value > 0), start }
}
