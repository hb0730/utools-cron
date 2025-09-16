<script setup lang="ts">
import { ref } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'

const isDark = ref(false)

function toggleTheme() {
  // 在html元素上切换dark类
  document.documentElement.classList.toggle('dark', isDark.value)

  // Element Plus 深色主题切换
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
  else {
    document.documentElement.classList.remove('dark')
  }

  // 保存设置
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')

  // 发出事件，通知其他组件
  window.dispatchEvent(new CustomEvent('theme-change', { detail: { isDark: isDark.value } }))
}

// 初始化主题
function initTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  }
  else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  // 应用主题
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  }
  else {
    document.documentElement.classList.remove('dark')
  }
}

// 初始化
initTheme()
</script>

<template>
  <el-switch
    v-model="isDark"
    :active-icon="Moon"
    :inactive-icon="Sunny"
    @change="toggleTheme"
  />
</template>
