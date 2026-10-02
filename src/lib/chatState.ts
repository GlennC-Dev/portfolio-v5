import { useSyncExternalStore } from 'react'

/**
 * Chat window open/close state. One tiny store so the desktop trigger, the
 * window itself, and the phone tab bar's Chathead button all agree without
 * threading props through the app shell.
 */
let isOpen = false
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

export function openChat() {
  if (isOpen) return
  isOpen = true
  emit()
}

export function closeChat() {
  if (!isOpen) return
  isOpen = false
  emit()
}

export function toggleChat() {
  isOpen = !isOpen
  emit()
}

export function useChatOpen(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => isOpen,
    () => false,
  )
}
