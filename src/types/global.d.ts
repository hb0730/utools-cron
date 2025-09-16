// uTools 类型声明
declare global {
  interface Window {
    utools?: {
      copyText: (text: string) => void
      onPluginEnter: (callback: (action?: any) => void) => void
    }
  }
}

// Element Plus locale 模块声明
declare module 'element-plus/dist/locale/zh-cn.mjs' {
  const locale: any
  export default locale
}

export {}
