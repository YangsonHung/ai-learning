<template>
  <Transition name="toast" appear>
    <div
      v-if="visible"
      :class="['toast', `toast-${type}`]"
      role="alert"
      aria-live="polite"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)

let timeoutId = null

const show = () => {
  visible.value = true
  timeoutId = setTimeout(() => {
    hide()
  }, props.duration)
}

const hide = () => {
  visible.value = false
  emit('close')
}

onMounted(() => {
  show()
})

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>