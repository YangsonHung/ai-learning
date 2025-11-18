import { ref, onMounted, watch } from 'vue'

export function useTheme() {
  const currentTheme = ref('auto')

  const themeNames = {
    light: '亮色',
    dark: '暗色',
    auto: '系统'
  }

  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'auto'
    setTheme(savedTheme)
  }

  const setTheme = (theme) => {
    currentTheme.value = theme
    localStorage.setItem('theme', theme)
    applyTheme(theme)
  }

  const applyTheme = (theme) => {
    const html = document.documentElement

    // 移除现有主题类
    html.classList.remove('theme-light', 'theme-dark')

    if (theme === 'auto') {
      // 跟随系统偏好
      applySystemTheme()
    } else {
      // 应用指定主题
      html.classList.add(`theme-${theme}`)
    }
  }

  const applySystemTheme = () => {
    const html = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (prefersDark) {
      html.classList.add('theme-dark')
    } else {
      html.classList.add('theme-light')
    }

    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (localStorage.getItem('theme') === 'auto') {
        if (e.matches) {
          html.classList.add('theme-dark')
          html.classList.remove('theme-light')
        } else {
          html.classList.add('theme-light')
          html.classList.remove('theme-dark')
        }
      }
    })
  }

  const getThemeName = (theme) => {
    return themeNames[theme] || theme
  }

  const changeTheme = (theme) => {
    setTheme(theme)
    return `已切换到${getThemeName(theme)}主题`
  }

  onMounted(() => {
    initTheme()
  })

  return {
    currentTheme,
    setTheme,
    changeTheme,
    getThemeName
  }
}