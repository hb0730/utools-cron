import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'

// Element Plus
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// UnoCSS
import 'virtual:uno.css'

// 自定义主题样式
import './styles/theme.css'

const app = createApp(App)

app.use(ElementPlus)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err, '组件:', vm, '错误信息:', info)
}

// 捕获未处理的Promise错误
window.addEventListener('unhandledrejection', event => {
  console.error('未处理的Promise错误:', event.reason)
  event.preventDefault()
})

app.mount('#app')
