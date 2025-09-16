// 简化的类型定义
export type CronType = 'linux' | 'spring' | 'quartz'

export interface CronExpression {
  expression: string
  type: CronType
  isValid: boolean
  description: string
  nextExecutions?: string[]
}

export interface CronField {
  seconds?: string
  minutes: string
  hours: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
  year?: string
}

export interface ConversionResult {
  success: boolean
  result?: string
  error?: string
}

// Cron类型选项
export const CRON_TYPE_OPTIONS = [
  { label: 'Linux Cron (5字段)', value: 'linux' },
  { label: 'Spring Cron (6字段)', value: 'spring' },
  { label: 'Quartz Cron (6-7字段)', value: 'quartz' },
] as const

// 常用模板
export const COMMON_TEMPLATES = {
  linux: [
    { name: '每分钟', expression: '* * * * *', description: '每分钟执行一次' },
    { name: '每小时', expression: '0 * * * *', description: '每小时的0分执行' },
    { name: '每天午夜', expression: '0 0 * * *', description: '每天午夜12点执行' },
    { name: '工作日上午9点', expression: '0 9 * * 1-5', description: '周一到周五上午9点执行' },
  ],
  spring: [
    { name: '每分钟', expression: '0 * * * * *', description: '每分钟执行一次' },
    { name: '每小时', expression: '0 0 * * * *', description: '每小时的0分0秒执行' },
    { name: '每天午夜', expression: '0 0 0 * * *', description: '每天午夜12点执行' },
    { name: '工作日上午9点', expression: '0 0 9 * * MON-FRI', description: '周一到周五上午9点执行' },
  ],
  quartz: [
    { name: '每分钟', expression: '0 * * ? * *', description: '每分钟执行一次' },
    { name: '每小时', expression: '0 0 * ? * *', description: '每小时的0分0秒执行' },
    { name: '每天午夜', expression: '0 0 0 ? * *', description: '每天午夜12点执行' },
    { name: '工作日上午9点', expression: '0 0 9 ? * MON-FRI', description: '周一到周五上午9点执行' },
  ],
}
