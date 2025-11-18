# DeepSeek Vue 项目

这是基于 Vue 3 移植的 DeepSeek AI 助手项目，从原生 JavaScript 版本转换而来。

## 项目特性

- 🎨 **主题切换**: 支持亮色、暗色和跟随系统主题
- 🤖 **AI 对话**: 集成 DeepSeek AI 进行智能对话
- ⚡ **流式响应**: 实时显示 AI 回复内容
- 📱 **响应式设计**: 适配移动端和桌面端
- 🔔 **Toast 通知**: 友好的操作反馈
- ⌨️ **快捷键支持**: Enter 发送，ESC 重置

## 技术栈

- **Vue 3**: 使用 Composition API
- **Vite**: 快速的构建工具
- **JavaScript ES6+**: 现代 JavaScript 特性
- **CSS3**: 支持主题切换和动画效果

## 快速开始

### 1. 安装依赖

```bash
npm install
# 或
pnpm install
```

### 2. 配置 API 密钥

在项目根目录创建 `.env` 文件：

```env
VITE_DEEPSEEK_API_KEY=your_actual_api_key_here
```

### 3. 启动开发服务器

```bash
npm run dev
# 或
pnpm dev
```

访问 http://localhost:3003 查看应用。

## 项目结构

```
src/
├── components/
│   └── Toast.vue              # Toast 通知组件
├── composables/
│   ├── useTheme.js           # 主题管理逻辑
│   ├── useToast.js           # Toast 通知管理
│   └── useDeepSeek.js        # DeepSeek AI 对话逻辑
├── App.vue                   # 主应用组件
├── main.js                   # 应用入口
└── style.css                 # 全局样式
```

## 核心功能说明

### 主题切换
- **亮色主题**: 适合白天使用
- **暗色主题**: 适合夜间使用
- **自动主题**: 跟随系统设置

### AI 对话
- 支持流式响应，实时显示 AI 回复
- 自动管理对话历史
- 支持多轮对话

### 快捷键
- `Enter`: 发送消息
- `Ctrl + Enter`: 换行
- `ESC`: 重置对话/关闭聊天窗口

## 开发说明

### Composables

项目使用 Vue 3 的 Composition API，将核心逻辑封装在 composables 中：

- `useTheme`: 管理主题切换逻辑
- `useToast`: 管理 Toast 通知
- `useDeepSeek`: 管理 DeepSeek AI 对话

### 样式系统

使用 CSS 变量实现主题切换，支持亮色和暗色主题的动态切换。

## 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 注意事项

1. 请确保配置正确的 DeepSeek API 密钥
2. API 调用需要网络连接
3. 建议在生产环境中使用 HTTPS

## 从原项目移植的变化

- ✅ 将原生 JavaScript 转换为 Vue 3 Composition API
- ✅ 组件化架构，提高代码复用性
- ✅ 响应式状态管理
- ✅ 更好的 TypeScript 支持（可选）
- ✅ 模块化的组织结构
- ✅ 保持了原有的所有功能和样式

## 许可证

MIT License
