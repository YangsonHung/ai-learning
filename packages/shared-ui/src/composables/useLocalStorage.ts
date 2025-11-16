import { ref, watchEffect, type Ref } from 'vue'
import { storage } from '@ai-learning/shared-utils'

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [ref: Ref<T>, setValue: (value: T) => void] {
  const storedValue = storage.get<T>(key, defaultValue)
  const value = ref<T>(storedValue)

  const setValue = (newValue: T) => {
    value.value = newValue
  }

  watchEffect(() => {
    storage.set(key, value.value)
  })

  return [value, setValue]
}