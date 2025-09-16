<script setup lang="ts">
import { nextTick, ref } from 'vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ThemeSwitch from './components/ThemeSwitch.vue'
import CronGenerator from './components/CronGenerator.vue'
import CronConverter from './components/CronConverter.vue'
import ApiTester from './components/ApiTester.vue'
import { useTheme } from './composables/useTheme'

// 标签页状态
const activeTab = ref('generator')

// 使用统一的主题管理
const { isDark } = useTheme()

// 判断是否为标准Cron表达式的工具函数
function isStandardCronExpression(input: string): boolean {
  // 简化的Cron表达式正则 - 包含数字、*、?、/、字母、空格、-
  const cronRegex = /^[\d*?/A-Z\s-]+$/i
  return cronRegex.test(input.trim()) && input.trim().split(/\s+/).length >= 5
}

// uTools 适配
if (window.utools) {
  window.utools.onPluginEnter((action) => {
    console.log('uTools plugin enter', action)

    // 如果是通过over或regex进入的，根据输入类型智能切换页面
    if (action && action.code === 'cron') {
      const input = action.payload || ''
      console.log('Input detected:', input)

      if (isStandardCronExpression(input)) {
        // 标准Cron表达式，切换到生成器页面进行解析和显示
        console.log('Detected standard cron expression, switching to generator')
        activeTab.value = 'generator'

        nextTick(() => {
          // 派发自定义事件来通知CronGenerator组件
          window.dispatchEvent(new CustomEvent('utools-cron-parse', {
            detail: { expression: input.trim() },
          }))
        })
      }
      else {
        // 中文描述，切换到生成器页面
        console.log('Detected natural language input, switching to generator')
        activeTab.value = 'generator'

        nextTick(() => {
          // 派发自定义事件来通知CronGenerator组件
          window.dispatchEvent(new CustomEvent('utools-cron-generate', {
            detail: { description: '' },
          }))
        })
      }
    }
  })
}
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900" :class="[isDark ? 'dark' : '']">
    <el-config-provider :locale="zhCn">
      <!-- 顶部栏 -->
      <div class="h-14 flex items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-800">
        <div class="flex items-center gap-2">
          <img src="/logo.svg" alt="Logo" class="h-6 w-6">
          <span class="text-lg font-semibold">Cron工具</span>
        </div>
        <ThemeSwitch />
      </div>

      <!-- 主内容 -->
      <div class="mx-auto max-w-4xl p-4">
        <el-tabs v-model="activeTab" type="border-card">
          <!-- Cron生成器 -->
          <el-tab-pane label="生成器" name="generator">
            <CronGenerator />
          </el-tab-pane>

          <!-- 格式转换器 -->
          <el-tab-pane label="格式转换" name="converter">
            <CronConverter />
          </el-tab-pane>

          <!-- API测试 -->
          <el-tab-pane label="API测试" name="api">
            <ApiTester />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-config-provider>
  </div>
</template>

<style scoped>
/* Element Plus 主题覆盖 */
.el-card {
  border-color: #e5e7eb;
}

.dark .el-card {
  border-color: #374151;
  background-color: #1f2937;
}

.el-card :deep(.el-card__header) {
  background-color: #f9fafb;
}

.dark .el-card :deep(.el-card__header) {
  background-color: rgba(31, 41, 55, 0.5);
}
</style>
