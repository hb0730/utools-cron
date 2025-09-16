import { computed, onUnmounted, ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * 应用主题到DOM
 */
function applyTheme(dark: boolean) {
  const htmlElement = document.documentElement

  if (dark) {
    htmlElement.classList.add('dark')
  }
  else {
    htmlElement.classList.remove('dark')
  }
}

/**
 * 主题管理 composable
 * 集成原生 matchMedia API，提供响应式主题状态管理
 */
export function useTheme() {
  // 响应式主题状态
  const isDark = ref(false)

  // 系统主题媒体查询
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  // 计算属性：主题字符串
  const theme = computed(() => isDark.value ? 'dark' : 'light')

  /**
   * 获取系统主题偏好
   */
  function getSystemTheme(): boolean {
    return mediaQuery.matches
  }

  /**
   * 初始化主题
   * 优先级：localStorage > 系统偏好 > 默认light
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme && (savedTheme === 'dark' || savedTheme === 'light')) {
      isDark.value = savedTheme === 'dark'
    }
    else {
      isDark.value = getSystemTheme()
    }

    applyTheme(isDark.value)
  }

  /**
   * 设置主题
   */
  function setTheme(newTheme: 'dark' | 'light') {
    isDark.value = newTheme === 'dark'
    applyTheme(isDark.value)
    localStorage.setItem('theme', newTheme)
  }

  /**
   * 切换主题
   */
  function toggleTheme() {
    const newTheme = isDark.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  /**
   * 系统主题变化监听器
   */
  function handleSystemThemeChange(e: MediaQueryListEvent) {
    // 只有在没有用户手动设置时才跟随系统
    const savedTheme = localStorage.getItem('theme')
    if (!savedTheme) {
      isDark.value = e.matches
      applyTheme(isDark.value)
    }
  }

  // 监听系统主题变化
  mediaQuery.addEventListener('change', handleSystemThemeChange)

  // 初始化主题
  initTheme()

  // 清理事件监听器
  onUnmounted(() => {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  })

  return {
    isDark,
    theme,
    toggleTheme,
    setTheme,
    getSystemTheme,
  }
}
