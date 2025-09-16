<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import type { CronExpression, CronType } from '@/types'
import { COMMON_TEMPLATES, CRON_TYPE_OPTIONS } from '@/types'
import { CronParser } from '@/utils/cronParser'

// 生成器状态
const cronType = ref<CronType>('linux')
const selectedTemplate = ref('')
const currentExpression = ref('')
const parseResult = ref<CronExpression | null>(null)

// 当前模板
const currentTemplates = computed(() => COMMON_TEMPLATES[cronType.value])

// 加载模板
function loadTemplate(expression: string) {
  currentExpression.value = expression
  parseExpression()
}

// 解析表达式
function parseExpression() {
  if (!currentExpression.value.trim()) {
    ElMessage.warning('请输入Cron表达式')
    return
  }

  parseResult.value = CronParser.parse(currentExpression.value.trim(), cronType.value)

  if (parseResult.value.isValid) {
    ElMessage.success('解析成功')
  }
  else {
    ElMessage.error('表达式无效')
  }
}

// 复制表达式
async function copyExpression() {
  if (!currentExpression.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  try {
    if (window.utools) {
      window.utools.copyText(currentExpression.value)
    }
    else {
      await navigator.clipboard.writeText(currentExpression.value)
    }
    ElMessage.success('已复制到剪贴板')
  }
  catch {
    ElMessage.error('复制失败')
  }
}

// 清空表达式
function clearExpression() {
  currentExpression.value = ''
  selectedTemplate.value = ''
  parseResult.value = null
}

// 处理uTools传入的Cron表达式
function handleUtoolsCronInput(event: any) {
  const { expression } = event.detail
  if (expression) {
    currentExpression.value = expression

    // 根据表达式字段数自动判断类型
    const fields = expression.trim().split(/\s+/)
    if (fields.length === 5) {
      cronType.value = 'linux'
    }
    else if (fields.length === 6) {
      cronType.value = 'spring'
    }

    // 自动解析表达式
    parseExpression()
  }
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('utools-cron-input', handleUtoolsCronInput)
  window.addEventListener('utools-cron-parse', handleUtoolsCronInput)
})

onUnmounted(() => {
  window.removeEventListener('utools-cron-input', handleUtoolsCronInput)
  window.removeEventListener('utools-cron-parse', handleUtoolsCronInput)
})
</script>

<template>
  <div>
    <el-form label-width="100px" size="default" class="max-w-2xl">
      <el-form-item label="Cron类型">
        <el-select v-model="cronType" placeholder="选择类型" class="w-full">
          <el-option
            v-for="option in CRON_TYPE_OPTIONS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="常用模板">
        <el-select v-model="selectedTemplate" placeholder="选择模板" class="w-full" clearable @change="loadTemplate">
          <el-option
            v-for="template in currentTemplates"
            :key="template.name"
            :label="`${template.name} - ${template.description}`"
            :value="template.expression"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="Cron表达式">
        <el-input v-model="currentExpression" placeholder="输入或生成Cron表达式" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="parseExpression">
          解析表达式
        </el-button>
        <el-button @click="copyExpression">
          复制表达式
        </el-button>
        <el-button @click="clearExpression">
          清空
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 解析结果 -->
    <el-card v-if="parseResult" class="mt-4 shadow-sm">
      <template #header>
        <span class="font-medium">解析结果</span>
      </template>

      <div class="space-y-4">
        <div>
          <el-tag :type="parseResult.isValid ? 'success' : 'danger'" class="mb-2">
            {{ parseResult.isValid ? '✓ 有效表达式' : '✗ 无效表达式' }}
          </el-tag>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ parseResult.description }}
          </p>
        </div>

        <div v-if="parseResult.nextExecutions?.length">
          <h4 class="mb-2 text-sm font-medium">
            接下来5次执行时间：
          </h4>
          <ul class="rounded bg-gray-50 p-3 text-sm space-y-1 dark:bg-gray-800">
            <li v-for="(time) in parseResult.nextExecutions" :key="time" class="flex justify-between">
              <span>{{ time }}</span>
            </li>
          </ul>
        </div>
      </div>
    </el-card>
  </div>
</template>
