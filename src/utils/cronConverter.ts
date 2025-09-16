import { CronParser } from './cronParser'
import type { ConversionResult, CronType } from '@/types'

export class CronConverter {
  /**
   * 转换Cron表达式格式
   */
  static convert(expression: string, fromType: CronType, toType: CronType): ConversionResult {
    if (fromType === toType) {
      return { success: true, result: expression }
    }

    try {
      // 检查表达式有效性
      if (!expression || typeof expression !== 'string') {
        return { success: false, error: '表达式不能为空' }
      }

      // 验证源表达式
      if (!CronParser.validate(expression, fromType)) {
        return { success: false, error: '源表达式无效' }
      }

      const parts = expression.trim().split(/\s+/)
      let result = ''

      switch (`${fromType}->${toType}`) {
        case 'linux->spring':
          result = this.linuxToSpring(parts)
          break
        case 'linux->quartz':
          result = this.linuxToQuartz(parts)
          break
        case 'spring->linux':
          result = this.springToLinux(parts)
          break
        case 'spring->quartz':
          result = this.springToQuartz(parts)
          break
        case 'quartz->linux':
          result = this.quartzToLinux(parts)
          break
        case 'quartz->spring':
          result = this.quartzToSpring(parts)
          break
        default:
          return { success: false, error: '不支持的转换类型' }
      }

      // 验证转换结果
      if (!CronParser.validate(result, toType)) {
        return { success: false, error: '转换结果无效' }
      }

      return { success: true, result }
    }
    catch (error) {
      return { success: false, error: `转换失败: ${error}` }
    }
  }

  private static linuxToSpring(parts: string[]): string {
    // Linux (5字段) -> Spring (6字段): 添加秒字段
    return `0 ${parts.join(' ')}`
  }

  private static linuxToQuartz(parts: string[]): string {
    // Linux (5字段) -> Quartz (6字段): 添加秒字段，处理日期/星期冲突
    const [min, hour, day, month, week] = parts

    // Quartz要求日期和星期字段之一必须为?
    if (day !== '*' && week !== '*') {
      return `0 ${min} ${hour} ${day} ${month} ?`
    }
    else if (day === '*' && week !== '*') {
      return `0 ${min} ${hour} ? ${month} ${week}`
    }
    else {
      return `0 ${min} ${hour} ${day} ${month} ${week}`
    }
  }

  private static springToLinux(parts: string[]): string {
    // Spring (6字段) -> Linux (5字段): 移除秒字段
    const [sec, ...rest] = parts

    // 检查秒字段是否为0或*
    if (sec !== '0' && sec !== '*') {
      throw new Error('秒字段不为0或*，无法转换为Linux格式')
    }

    return rest.join(' ')
  }

  private static springToQuartz(parts: string[]): string {
    // Spring (6字段) -> Quartz (6字段): 处理日期/星期冲突
    const [sec, min, hour, day, month, week] = parts

    if (day !== '*' && week !== '*') {
      return `${sec} ${min} ${hour} ${day} ${month} ?`
    }
    else if (day === '*' && week !== '*') {
      return `${sec} ${min} ${hour} ? ${month} ${week}`
    }
    else {
      return parts.join(' ')
    }
  }

  private static quartzToLinux(parts: string[]): string {
    // Quartz -> Linux: 移除秒字段，转换?为*
    const [sec, ...rest] = parts.slice(0, 6) // 忽略年份字段

    if (sec !== '0' && sec !== '*') {
      throw new Error('秒字段不为0或*，无法转换为Linux格式')
    }

    return rest.map(part => part === '?' ? '*' : part).join(' ')
  }

  private static quartzToSpring(parts: string[]): string {
    // Quartz -> Spring: 保留前6个字段，转换?为*
    return parts.slice(0, 6).map(part => part === '?' ? '*' : part).join(' ')
  }
}
