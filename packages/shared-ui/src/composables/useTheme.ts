import { ref, computed, watch } from 'vue'
import type { Theme, ThemeConfig } from '@ai-learning/shared-types'
import { storage, applyTheme } from '@ai-learning/shared-utils'

const STORAGE_KEY = 'theme-config'

const defaultConfig: ThemeConfig = {
  mode: 'auto',
  primaryColor: '#3b82f6',
  backgroundColor: '#ffffff',
  textColor: '#1f2937'
}

const themeConfig = ref<ThemeConfig>(
  storage.get(STORAGE_KEY, defaultConfig) || defaultConfig
)

export function useTheme() {
  const isDark = computed(() => {
    if (themeConfig.value.mode === 'dark') return true
    if (themeConfig.value.mode === 'light') return false

    // Auto mode: check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const updateTheme = (config: Partial<ThemeConfig>) => {
    themeConfig.value = { ...themeConfig.value, ...config }
    storage.set(STORAGE_KEY, themeConfig.value)
    applyTheme(themeConfig.value)
  }

  const setTheme = (mode: Theme) => {
    updateTheme({ mode })
  }

  const toggleTheme = () => {
    const newMode: Theme = isDark.value ? 'light' : 'dark'
    setTheme(newMode)
  }

  // Apply theme on mount and when config changes
  watch(themeConfig, applyTheme, { immediate: true })

  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', () => {
    if (themeConfig.value.mode === 'auto') {
      applyTheme(themeConfig.value)
    }
  })

  return {
    themeConfig: computed(() => themeConfig.value),
    isDark,
    setTheme,
    toggleTheme,
    updateTheme
  }
}