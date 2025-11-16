<template>
  <div :class="messageClasses">
    <div class="message-avatar">
      <div :class="avatarClasses">
        {{ avatarIcon }}
      </div>
    </div>

    <div class="message-content">
      <div class="message-header">
        <span class="message-role">{{ roleLabel }}</span>
        <span class="message-time">{{ formattedTime }}</span>
      </div>

      <div class="message-text">
        <template v-if="message.isTyping">
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </template>
        <template v-else>
          {{ message.content }}
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChatMessage } from '@ai-learning/shared-types'
import { formatTimestamp } from '@ai-learning/shared-utils'

interface Props {
  message: ChatMessage
}

const props = defineProps<Props>()

const messageClasses = computed(() => {
  const baseClasses = ['flex', 'gap-3', 'p-4', 'rounded-lg']

  const roleClasses = props.message.role === 'user'
    ? ['bg-blue-50', 'ml-auto', 'max-w-[80%]']
    : props.message.role === 'assistant'
    ? ['bg-gray-50', 'mr-auto', 'max-w-[80%]']
    : ['bg-yellow-50', 'mx-auto', 'max-w-[90%]']

  return [...baseClasses, ...roleClasses]
})

const avatarClasses = computed(() => {
  const baseClasses = [
    'w-8',
    'h-8',
    'rounded-full',
    'flex',
    'items-center',
    'justify-center',
    'text-sm',
    'font-medium',
    'flex-shrink-0'
  ]

  const roleColors = {
    user: ['bg-blue-600', 'text-white'],
    assistant: ['bg-gray-600', 'text-white'],
    system: ['bg-yellow-600', 'text-white']
  }

  return [...baseClasses, ...roleColors[props.message.role]]
})

const avatarIcon = computed(() => {
  const icons = {
    user: 'U',
    assistant: 'A',
    system: 'S'
  }
  return icons[props.message.role]
})

const roleLabel = computed(() => {
  const labels = {
    user: 'You',
    assistant: 'Assistant',
    system: 'System'
  }
  return labels[props.message.role]
})

const formattedTime = computed(() => {
  return formatTimestamp(props.message.timestamp)
})
</script>

<style scoped>
.message-content {
  @apply flex-1 space-y-1;
}

.message-header {
  @apply flex items-center justify-between text-sm;
}

.message-role {
  @apply font-medium text-gray-900;
}

.message-time {
  @apply text-gray-500;
}

.message-text {
  @apply text-gray-800 whitespace-pre-wrap break-words;
}

.typing-indicator {
  @apply flex space-x-1;
}

.typing-indicator span {
  @apply w-2 h-2 bg-gray-400 rounded-full animate-bounce;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.1s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.2s;
}
</style>