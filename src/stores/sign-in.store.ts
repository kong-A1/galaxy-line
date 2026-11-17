import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { SignInAction, SignInMethod } from '@/types/auth/auth.type'

const ACTION_STORAGE_KEY = 'sign-in-action'

// Which welcome button was pressed has to survive a reload of the sign-in page (it decides whether the register step
// exists), so it lives in sessionStorage: gone when the tab closes. Storage can throw (private mode, blocked site
// data): treat that as "nothing stored" and carry on.
function loadAction(): SignInAction {
  try {
    return sessionStorage.getItem(ACTION_STORAGE_KEY) === 'register' ? 'register' : 'sign-in'
  } catch {
    return 'sign-in'
  }
}

function saveAction(action: SignInAction) {
  try {
    if (action === 'register') sessionStorage.setItem(ACTION_STORAGE_KEY, action)
    else sessionStorage.removeItem(ACTION_STORAGE_KEY)
  } catch {
    // Nothing to do: the choice just will not survive a reload
  }
}

/**
 * Where the one-time code was sent, shared by the two steps of the sign-in page; kept in memory only. The pressed
 * welcome button (`action`) is the exception: see above.
 */
export const useSignInStore = defineStore('sign-in', () => {
  const action = ref<SignInAction>(loadAction())
  const method = ref<SignInMethod>('phone')
  const destination = ref('')
  const refCode = ref('')
  /** The code was accepted; the register step only opens after this */
  const verified = ref(false)

  function setAction(next: SignInAction) {
    action.value = next
    saveAction(next)
  }

  function setOtpRequest(nextMethod: SignInMethod, value: string, nextRefCode: string) {
    method.value = nextMethod
    destination.value = value
    refCode.value = nextRefCode
    verified.value = false
  }

  function markVerified() {
    verified.value = true
  }

  function setRefCode(nextRefCode: string) {
    refCode.value = nextRefCode
  }

  function clear() {
    destination.value = ''
    refCode.value = ''
    verified.value = false
    // Called once the person has left the flow: the next visit starts from the welcome page's own choice
    setAction('sign-in')
  }

  return {
    action,
    method,
    destination,
    refCode,
    verified,
    setAction,
    setOtpRequest,
    markVerified,
    setRefCode,
    clear,
  }
})
