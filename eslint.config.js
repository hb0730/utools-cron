import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '.github',
    'dist',
    'node_modules',
    'public',
  ],
  vue: true,
  typescript: true,
  unocss: true,
  formatters: {
    css: true,
    html: true,
  },
  rules: {
    // 允许使用未定义变量
    'no-undef': 'off',
    // 允许使用console
    'no-console': 'off',
    // 允许使用process
    'node/prefer-global/process': 'off',
    // 允许函数定义内部
    'unicorn/consistent-function-scoping': 'warn',
  },
})
