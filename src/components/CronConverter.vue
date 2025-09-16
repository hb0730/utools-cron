<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import type { CronType } from '@/types'
import { CRON_TYPE_OPTIONS } from '@/types'
import { CronConverter } from '@/utils/cronConverter'

// 转换器状态
const fromType = ref<CronType>('linux')
const toType = ref<CronType>('spring')
const sourceExpression = ref('')
const convertResult = ref('')

// 转换器能否执行转换
const canConvert = computed(() => {
  return sourceExpression.value.trim() && fromType.value !== toType.value
})

// 转换表达式
function convertExpression() {
  if (!sourceExpression.value.trim()) {
    ElMessage.warning('请输入源表达式')
    return
  }

  if (fromType.value === toType.value) {
    ElMessage.warning('源格式和目标格式不能相同')
    return
  }

  const result = CronConverter.convert(sourceExpression.value.trim(), fromType.value, toType.value)

  if (result.success) {
    convertResult.value = result.result || ''
    ElMessage.success('转换成功')
  }
  else {
    ElMessage.error(result.error || '转换失败')
    convertResult.value = ''
  }
}

// 交换类型
function swapTypes() {
  const temp = fromType.value
  fromType.value = toType.value
  toType.value = temp

  if (convertResult.value) {
    sourceExpression.value = convertResult.value
    convertResult.value = ''
  }
}

// 复制转换结果
async function copyConvertResult() {
  if (!convertResult.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  try {
    if (window.utools) {
      window.utools.copyText(convertResult.value)
    }
    else {
      await navigator.clipboard.writeText(convertResult.value)
    }
    ElMessage.success('已复制到剪贴板')
  }
  catch {
    ElMessage.error('复制失败')
  }
}

// 清空转换器
function clearConverter() {
  sourceExpression.value = ''
  convertResult.value = ''
}

// 处理从 utools 传入的 Cron 表达式
function handleUtoolsCronParse(event: CustomEvent) {
  const { expression } = event.detail
  console.log('CronConverter 接收到表达式:', expression)

  if (expression) {
    sourceExpression.value = expression

    // 根据表达式字段数自动判断类型
    const fields = expression.trim().split(/\s+/)
    if (fields.length === 5) {
      fromType.value = 'linux'
    }
    else if (fields.length === 6) {
      fromType.value = 'spring'
    }
  }
}

// 组件挂载时添加事件监听
onMounted(() => {
  window.addEventListener('utools-cron-parse', handleUtoolsCronParse as EventListener)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener('utools-cron-parse', handleUtoolsCronParse as EventListener)
})
</script>

<template>
  <div>
    <el-form label-width="100px" size="default" class="max-w-2xl">
      <el-form-item label="源格式">
        <el-select v-model="fromType" class="w-full">
          <el-option
            v-for="option in CRON_TYPE_OPTIONS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="目标格式">
        <el-select v-model="toType" class="w-full">
          <el-option
            v-for="option in CRON_TYPE_OPTIONS"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="源表达式">
        <el-input v-model="sourceExpression" placeholder="输入要转换的表达式" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :disabled="!canConvert" @click="convertExpression">
          转换表达式
        </el-button>
        <el-button @click="swapTypes">
          <el-icon><Refresh /></el-icon>
          交换格式
        </el-button>
        <el-button @click="clearConverter">
          清空
        </el-button>
      </el-form-item>

      <el-form-item v-if="convertResult" label="转换结果">
        <el-input v-model="convertResult" readonly>
          <template #append>
            <el-button @click="copyConvertResult">
              复制
            </el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <!-- 转换说明 -->
    <el-card class="mt-4 shadow-sm">
      <template #header>
        <span class="font-medium">格式说明</span>
      </template>
      <el-descriptions :column="1" border size="small">
        <el-descriptions-item label="Linux Cron">
          5个字段：分 时 日 月 周
        </el-descriptions-item>
        <el-descriptions-item label="Spring Cron">
          6个字段：秒 分 时 日 月 周
        </el-descriptions-item>
        <el-descriptions-item label="Quartz Cron">
          6-7个字段：秒 分 时 日 月 周 [年]，支持 ? 通配符
        </el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>
