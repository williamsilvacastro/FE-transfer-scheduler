import { ref } from 'vue'

export function useToast() {
  const show = ref(false)
  const message = ref('')
  const type = ref('info')
  let timeout = null

  const showToast = (msg, toastType = 'info', duration = 3000) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    message.value = msg
    type.value = toastType
    show.value = true

    timeout = setTimeout(() => {
      show.value = false
    }, duration)
  }

  const success = (msg, duration) => showToast(msg, 'success', duration)
  const error = (msg, duration) => showToast(msg, 'error', duration)
  const info = (msg, duration) => showToast(msg, 'info', duration)

  return {
    show,
    message,
    type,
    success,
    error,
    info
  }
} 