import { ref } from 'vue'
import { createApp } from 'vue'
import Toast from '../components/Toast.vue'

const toasts = ref([])

export function useToast() {
  const showToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now()

    // 创建 toast 容器（如果不存在）
    let toastContainer = document.getElementById('toast-container')
    if (!toastContainer) {
      toastContainer = document.createElement('div')
      toastContainer.id = 'toast-container'
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `
      document.body.appendChild(toastContainer)
    }

    // 创建 toast 元素
    const toastElement = document.createElement('div')
    toastContainer.appendChild(toastElement)

    // 创建 Vue 应用实例
    const toastApp = createApp(Toast, {
      message,
      type,
      duration,
      onClose: () => {
        setTimeout(() => {
          toastApp.unmount()
          toastElement.remove()

          // 如果没有 toast 了，移除容器
          if (toastContainer.children.length === 0) {
            toastContainer.remove()
          }
        }, 300)
      }
    })

    toastApp.mount(toastElement)

    return id
  }

  const showSuccess = (message, duration) => showToast(message, 'success', duration)
  const showError = (message, duration) => showToast(message, 'error', duration)
  const showInfo = (message, duration) => showToast(message, 'info', duration)

  return {
    showToast,
    showSuccess,
    showError,
    showInfo,
    toasts
  }
}