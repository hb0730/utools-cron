<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useTheme } from '../composables/useTheme'

// 使用统一的主题管理
const { isDark, toggleTheme } = useTheme()
</script>

<template>
  <el-switch
    v-model="isDark"
    :active-icon="Moon"
    :inactive-icon="Sunny"
    @change="toggleTheme"
  />
</template>
