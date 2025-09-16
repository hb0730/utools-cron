# Uhool Cron - Cron 表达式工具

> 支持 Linux/Spring/Quartz 三种 Cron 表达式的生成、解析、转换工具

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.x-409EFF?style=flat-square&logo=element)](https://element-plus.org/)
[![UnoCSS](https://img.shields.io/badge/UnoCSS-0.58-00C7B7?style=flat-square&logo=unocss)](https://unocss.dev/)

## 🚀 功能特性

### 📋 核心功能
- **🔧 Cron 生成器** - 通过可视化界面快速生成 Cron 表达式
- **📝 Cron 解析器** - 解析 Cron 表达式并显示人类可读的描述
- **🔄 格式转换** - 支持 Linux、Spring、Quartz 三种格式间的相互转换
- **⏰ 执行预览** - 实时显示接下来 5 次执行时间

### 📦 支持的 Cron 格式
| 格式 | 字段数 | 字段说明 | 示例 |
|------|--------|----------|------|
| **Linux Cron** | 5 | 分 时 日 月 周 | `0 9 * * 1-5` |
| **Spring Cron** | 6 | 秒 分 时 日 月 周 | `0 0 9 * * MON-FRI` |
| **Quartz Cron** | 6-7 | 秒 分 时 日 月 周 [年] | `0 0 9 ? * MON-FRI` |

### 🎯 使用场景
- **开发调试** - 快速验证和测试 Cron 表达式
- **系统集成** - 不同框架间的 Cron 表达式格式转换
- **学习工具** - 理解不同 Cron 格式的差异和用法
- **运维管理** - 定时任务配置的辅助工具

## 🛠️ 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI 组件**: Element Plus
- **样式方案**: UnoCSS
- **构建工具**: Vite
- **代码规范**: @antfu/eslint-config
- **Cron 解析**: cron-parser

## 📸 功能截图

### Cron 生成器
通过图形界面选择时间规则，自动生成对应的 Cron 表达式。

### Cron 解析器
输入 Cron 表达式，实时显示：
- 人类可读的描述
- 下次执行时间预览
- 表达式有效性验证

### 格式转换器
一键转换不同格式的 Cron 表达式：
- Linux → Spring/Quartz
- Spring → Linux/Quartz  
- Quartz → Linux/Spring

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- pnpm >= 8

### 安装依赖
```bash
pnpm install
```

### 开发运行
```bash
pnpm dev
```

### 构建项目
```bash
pnpm build
```

### 构建 utools 插件
```bash
pnpm build:plugin
```

## 📱 utools 插件使用

### 安装方式
1. 下载构建后的插件包
2. 在 utools 中选择"插件管理" → "安装本地插件"
3. 选择插件包文件进行安装

### 使用方法
在 utools 搜索框中输入以下关键词即可快速启动：
- `cron` - 启动 Cron 工具
- `定时任务` - 启动 Cron 工具
- `计划任务` - 启动 Cron 工具
- `crontab` - 启动 Cron 工具
- 或直接输入 Cron 表达式（如：`0 * * * * *`）

## 🎨 项目结构

```
uhool-cron/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── CronGenerator.vue    # Cron 生成器
│   │   ├── CronConverter.vue    # 格式转换器
│   │   ├── ApiTester.vue        # API 测试组件
│   │   └── ThemeSwitch.vue      # 主题切换
│   ├── utils/              # 工具函数
│   │   ├── cronParser.ts       # Cron 解析器
│   │   └── cronConverter.ts    # 格式转换器
│   ├── types/              # TypeScript 类型定义
│   └── styles/             # 样式文件
├── public/
│   └── plugin.json         # utools 插件配置
└── dist/                   # 构建输出目录
```

## 🔧 配置说明

### ESLint 配置
使用 @antfu/eslint-config 作为代码规范基础，支持：
- Vue 3 单文件组件
- TypeScript 类型检查
- 自动代码格式化

### UnoCSS 配置
- 原子化 CSS 方案
- 支持属性化模式
- 内置常用图标

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👤 作者

**hb0730**
- GitHub: [@hb0730](https://github.com/hb0730)
- 主页: [https://github.com/hb0730/uhool-cron](https://github.com/hb0730/uhool-cron)

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Element Plus](https://element-plus.org/) - 基于 Vue 3 的组件库
- [UnoCSS](https://unocss.dev/) - 即时原子化 CSS 引擎
- [cron-parser](https://github.com/harrisiirak/cron-parser) - Cron 表达式解析库
- [utools](https://u.tools/) - 强大的生产力工具平台

---

如果这个项目对您有帮助，请给个 ⭐️ 支持一下！