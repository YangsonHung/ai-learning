<template>
  <div class="input-container">
    <label v-if="label" :for="inputId" class="input-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>

    <textarea
      v-if="type === 'textarea'"
      :id="inputId"
      :class="inputClasses"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <input
      v-else
      :id="inputId"
      :type="type"
      :class="inputClasses"
      :placeholder="placeholder"
      :value="modelValue"
      :disabled="disabled"
      :required="required"
      @input="handleInput"
      @blur="handleBlur"
      @focus="handleFocus"
    />

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { InputProps } from '@ai-learning/shared-types'
import { generateId } from '@ai-learning/shared-utils'

interface Props extends InputProps {
  label?: string
  modelValue?: string
  error?: string
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  rows: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: []
  focus: []
}>()

const inputId = generateId()
const isFocused = ref(false)

const inputClasses = computed(() => {
  const baseClasses = [
    'w-full',
    'px-3',
    'py-2',
    'border',
    'rounded-md',
    'transition-colors',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:border-transparent'
  ]

  const stateClasses = props.error
    ? ['border-red-300', 'text-red-900', 'placeholder-red-300']
    : isFocused.value
    ? ['border-blue-500']
    : ['border-gray-300', 'text-gray-900', 'placeholder-gray-500']

  const disabledClasses = props.disabled
    ? ['bg-gray-50', 'text-gray-500', 'cursor-not-allowed']
    : ['bg-white']

  return [...baseClasses, ...stateClasses, ...disabledClasses]
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => {
  isFocused.value = false
  emit('blur')
}

const handleFocus = () => {
  isFocused.value = true
  emit('focus')
}
</script>

<style scoped>
.input-container {
  @apply space-y-1;
}

.input-label {
  @apply block text-sm font-medium text-gray-700;
}

.required-indicator {
  @apply text-red-500;
}

.error-message {
  @apply text-sm text-red-600;
}
</style>