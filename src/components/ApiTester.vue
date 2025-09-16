<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Connection, Delete, Document, Loading, Plus } from '@element-plus/icons-vue'

// API测试状态
const apiUrl = ref('')
const apiMethod = ref('POST')
const apiRequestBody = ref('')
const apiHeaders = ref([
  { key: 'Content-Type', value: 'application/json' },
  { key: 'Authorization', value: '' },
])
const selectedApiTemplate = ref('')
const apiResult = ref('')
const apiStatus = ref(0)
const apiResponseTime = ref(0)
const apiResponseHeaders = ref<Record<string, string> | null>(null)
const apiLoading = ref(false)

// 请求体占位符
const placeholderText = `{
  "expression": "0 0 * * *",
  "type": "linux"
}`

// 添加Header
function addHeader() {
  apiHeaders.value.push({ key: '', value: '' })
}

// 移除Header
function removeHeader(index: number) {
  apiHeaders.value.splice(index, 1)
}

// 加载API模板
function loadApiTemplate(template: string) {
  const templates = {
    validate: {
      url: 'https://api.example.com/cron/validate',
      method: 'POST',
      body: `{
  "expression": "0 0 * * *",
  "type": "linux"
}`,
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'X-API-Key', value: 'your-api-key-here' },
      ],
    },
    create: {
      url: 'https://api.example.com/jobs/create',
      method: 'POST',
      body: `{
  "name": "My Cron Job",
  "expression": "0 0 * * *",
  "type": "linux",
  "command": "echo Hello World"
}`,
      headers: [
        { key: 'Content-Type', value: 'application/json' },
        { key: 'Authorization', value: 'Bearer your-token-here' },
      ],
    },
    query: {
      url: 'https://api.example.com/jobs/list',
      method: 'GET',
      body: '',
      headers: [
        { key: 'Authorization', value: 'Bearer your-token-here' },
      ],
    },
  }

  const templateData = templates[template as keyof typeof templates]
  if (templateData) {
    apiUrl.value = templateData.url
    apiMethod.value = templateData.method
    apiRequestBody.value = templateData.body
    apiHeaders.value = [...templateData.headers]
  }
}

// 格式化请求体
function formatRequestBody() {
  try {
    const parsed = JSON.parse(apiRequestBody.value)
    apiRequestBody.value = JSON.stringify(parsed, null, 2)
    ElMessage.success('JSON格式化成功')
  }
  catch {
    ElMessage.error('JSON格式错误')
  }
}

// 测试API
async function testApi() {
  if (!apiUrl.value.trim()) {
    ElMessage.warning('请输入API地址')
    return
  }

  apiLoading.value = true
  const startTime = Date.now()

  try {
    // 构建headers
    const headers: Record<string, string> = {}
    apiHeaders.value.forEach((header) => {
      if (header.key.trim() && header.value.trim()) {
        headers[header.key.trim()] = header.value.trim()
      }
    })

    // 构建请求配置
    const requestOptions: RequestInit = {
      method: apiMethod.value,
      headers,
    }

    // 如果不是GET请求且有请求体，添加body
    if (apiMethod.value !== 'GET' && apiRequestBody.value.trim()) {
      requestOptions.body = apiRequestBody.value.trim()
    }

    const response = await fetch(apiUrl.value, requestOptions)
    const endTime = Date.now()

    apiResponseTime.value = endTime - startTime
    apiStatus.value = response.status

    // 获取响应headers
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })
    apiResponseHeaders.value = responseHeaders

    // 获取响应体
    const contentType = response.headers.get('content-type') || ''
    let result
    if (contentType && typeof contentType === 'string' && contentType.includes('application/json')) {
      result = await response.json()
      apiResult.value = JSON.stringify(result, null, 2)
    }
    else {
      result = await response.text()
      apiResult.value = result
    }

    if (response.ok) {
      ElMessage.success(`请求成功 (${response.status})`)
    }
    else {
      ElMessage.error(`请求失败 (${response.status})`)
    }
  }
  catch (error) {
    const endTime = Date.now()
    apiResponseTime.value = endTime - startTime
    apiStatus.value = 0
    apiResult.value = `请求错误: ${error}`
    ElMessage.error('请求失败')
  }
  finally {
    apiLoading.value = false
  }
}

// 复制API响应
async function copyApiResult() {
  if (!apiResult.value) {
    ElMessage.warning('没有可复制的内容')
    return
  }

  try {
    if (window.utools) {
      window.utools.copyText(apiResult.value)
    }
    else {
      await navigator.clipboard.writeText(apiResult.value)
    }
    ElMessage.success('已复制到剪贴板')
  }
  catch {
    ElMessage.error('复制失败')
  }
}

// 清空API
function clearApi() {
  apiUrl.value = ''
  apiMethod.value = 'POST'
  apiRequestBody.value = ''
  apiHeaders.value = [
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: '' },
  ]
  selectedApiTemplate.value = ''
  apiResult.value = ''
  apiStatus.value = 0
  apiResponseTime.value = 0
  apiResponseHeaders.value = null
}
</script>

<template>
  <div class="max-w-4xl">
    <el-alert
      title="API功能"
      description="集成外部Cron相关API，支持自定义Header、请求方法等"
      type="info"
      show-icon
      :closable="false"
    />

    <el-row :gutter="20" class="mt-4">
      <!-- 左侧：请求配置 -->
      <el-col :span="12">
        <el-card class="shadow-sm">
          <template #header>
            <span class="font-medium">请求配置</span>
          </template>

          <el-form label-width="100px" size="default">
            <el-form-item label="HTTP方法">
              <el-select v-model="apiMethod" class="w-full">
                <el-option label="GET" value="GET" />
                <el-option label="POST" value="POST" />
                <el-option label="PUT" value="PUT" />
                <el-option label="DELETE" value="DELETE" />
              </el-select>
            </el-form-item>

            <el-form-item label="API地址">
              <el-input v-model="apiUrl" placeholder="https://api.example.com/cron/validate" />
            </el-form-item>

            <el-form-item label="快速模板">
              <el-select v-model="selectedApiTemplate" placeholder="选择API模板" clearable @change="loadApiTemplate">
                <el-option label="Cron验证API" value="validate" />
                <el-option label="任务创建API" value="create" />
                <el-option label="任务查询API" value="query" />
              </el-select>
            </el-form-item>

            <el-form-item label="请求Headers">
              <div class="space-y-2">
                <div v-for="(header, index) in apiHeaders" :key="index" class="flex gap-2">
                  <el-input v-model="header.key" placeholder="Header名称" class="flex-1" />
                  <el-input v-model="header.value" placeholder="Header值" class="flex-1" />
                  <el-button type="danger" size="small" @click="removeHeader(index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
                <el-button size="small" class="w-full" @click="addHeader">
                  <el-icon><Plus /></el-icon>
                  添加Header
                </el-button>
              </div>
            </el-form-item>

            <el-form-item label="请求体">
              <el-input
                v-model="apiRequestBody"
                type="textarea"
                :rows="6"
                :placeholder="placeholderText"
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="apiLoading" @click="testApi">
                <el-icon><Connection /></el-icon>
                发送请求
              </el-button>
              <el-button @click="clearApi">
                清空
              </el-button>
              <el-button @click="formatRequestBody">
                格式化JSON
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <!-- 右侧：响应结果 -->
      <el-col :span="12">
        <el-card class="shadow-sm">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-medium">响应结果</span>
              <el-tag v-if="apiStatus" :type="apiStatus < 300 ? 'success' : 'danger'">
                {{ apiStatus }}
              </el-tag>
            </div>
          </template>

          <div v-if="!apiResult && !apiLoading" class="py-8 text-center text-gray-400">
            <el-icon size="48">
              <Document />
            </el-icon>
            <p class="mt-2">
              发送请求后将显示响应结果
            </p>
          </div>

          <div v-if="apiLoading" class="py-8 text-center">
            <el-icon class="animate-spin" size="24">
              <Loading />
            </el-icon>
            <p class="mt-2">
              请求中...
            </p>
          </div>

          <div v-if="apiResult" class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">响应时间: {{ apiResponseTime }}ms</span>
              <el-button size="small" @click="copyApiResult">
                复制响应
              </el-button>
            </div>

            <el-tabs type="border-card" size="small">
              <el-tab-pane label="响应体">
                <el-input
                  v-model="apiResult"
                  type="textarea"
                  :rows="12"
                  readonly
                  class="text-sm font-mono"
                />
              </el-tab-pane>

              <el-tab-pane v-if="apiResponseHeaders" label="响应Headers">
                <div class="max-h-64 overflow-y-auto space-y-1">
                  <div v-for="(value, key) in apiResponseHeaders" :key="key" class="flex">
                    <span class="w-32 text-sm text-gray-600 font-medium">{{ key }}:</span>
                    <span class="flex-1 text-sm">{{ value }}</span>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
