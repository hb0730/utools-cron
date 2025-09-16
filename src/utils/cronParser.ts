import parser from 'cron-parser'
import type { CronExpression, CronType } from '@/types'

export class CronParser {
  /**
   * 验证Cron表达式
   */
  static validate(expression: string, type: CronType): boolean {
    try {
      const normalizedExpression = this.normalizeExpression(expression, type)
      parser.parseExpression(normalizedExpression)
      return true
    }
    catch {
      return false
    }
  }

  /**
   * 解析Cron表达式并获取描述
   */
  static parse(expression: string, type: CronType): CronExpression {
    try {
      const normalizedExpression = this.normalizeExpression(expression, type)
      // 验证表达式是否有效
      parser.parseExpression(normalizedExpression)

      return {
        expression,
        type,
        isValid: true,
        description: this.getDescription(expression, type),
        nextExecutions: this.getNextExecutions(expression, type, 5),
      }
    }
    catch (error) {
      return {
        expression,
        type,
        isValid: false,
        description: `无效的Cron表达式: ${error}`,
      }
    }
  }

  /**
   * 获取下次执行时间
   */
  static getNextExecutions(expression: string, type: CronType, count = 5): string[] {
    try {
      const normalizedExpression = this.normalizeExpression(expression, type)
      const interval = parser.parseExpression(normalizedExpression)
      const results: string[] = []

      for (let i = 0; i < count; i++) {
        const next = interval.next()
        results.push(next.toDate().toLocaleString('zh-CN'))
      }

      return results
    }
    catch {
      return []
    }
  }

  /**
   * 标准化表达式格式
   */
  private static normalizeExpression(expression: string, type: CronType): string {
    if (!expression || typeof expression !== 'string') {
      return ''
    }
    const parts = expression.trim().split(/\s+/)

    switch (type) {
      case 'linux':
        // Linux: 5字段 -> 6字段 (添加秒)
        return parts.length === 5 ? `0 ${expression}` : expression
      case 'spring':
        // Spring: 6字段，直接使用
        return expression
      case 'quartz':
        // Quartz: 处理?通配符，转换为标准格式
        return this.convertQuartzToStandard(expression)
      default:
        return expression
    }
  }

  /**
   * 转换Quartz格式到标准格式
   */
  private static convertQuartzToStandard(expression: string): string {
    return expression.replace(/\?/g, '*')
  }

  /**
   * 获取人类可读的描述
   */
  private static getDescription(expression: string, type: CronType): string {
    if (!expression || typeof expression !== 'string') {
      return '无效的Cron表达式'
    }
    const parts = expression.trim().split(/\s+/)

    try {
      const descriptions: string[] = []

      if (type === 'linux') {
        const [min, hour, day, month, week] = parts
        descriptions.push(`分钟: ${min}`, `小时: ${hour}`, `日期: ${day}`, `月份: ${month}`, `星期: ${week}`)
      }
      else {
        const [sec, min, hour, day, month, week] = parts
        descriptions.push(`秒: ${sec}`, `分钟: ${min}`, `小时: ${hour}`, `日期: ${day}`, `月份: ${month}`, `星期: ${week}`)
      }

      return descriptions.join(', ')
    }
    catch {
      return '表达式格式错误'
    }
  }
}
