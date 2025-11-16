# AI 学习项目集

> 🎓 这是一个用于学习前端和 AI 应用开发的项目集合，仅供学习参考使用。

## 📁 项目结构

```
ai-learning/
├── coze/          # 基于 Coze API 的 AI 助手应用
├── deepseek/      # 基于 DeepSeek API 的项目（待完善）
└── README.md      # 本文档
```

## 🚀 包含的项目

### 1. coze - AI 助手应用

- **功能**: 基于 Coze API 的智能对话助手
- **技术栈**: Vue 3 + TypeScript + Vite + pnpm
- **特点**:
  - 纯前端单页面应用
  - 精确的时间显示
  - PC 端优化的响应式设计
  - 优雅的加载状态和错误处理

### 2. deepseek - AI 项目（开发中）

- **状态**: 项目初始化，待完善
- **计划**: 基于 DeepSeek API 的 AI 应用

## 🛠️ 技术栈

- **前端框架**: Vue 3.5+
- **类型系统**: TypeScript 5.9+
- **构建工具**: Vite 7.1+
- **包管理器**: pnpm 10.20.0+
- **代码风格**: ESLint + Prettier

## 📦 安装和运行

### 环境要求

- Node.js: `^20.19.0 || >=22.12.0`
- pnpm: `>=8.0.0`

### 安装 pnpm

如果还没有安装 pnpm：

```bash
npm install -g pnpm
# 或者
npx pnpm add -g pnpm
```

### 运行项目

#### coze 项目

```bash
# 进入项目目录
cd coze

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

#### deepseek 项目

```bash
# 进入项目目录
cd deepseek

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

## 🔧 开发工具

### 可用脚本

每个项目都包含以下脚本：

```bash
pnpm dev          # 启动开发服务器
pnpm build        # 构建生产版本
pnpm preview      # 预览构建结果
pnpm lint         # 代码检查和修复
```

### 环境配置

对于需要 API 密钥的项目（如 coze），需要在项目根目录创建 `.env` 文件：

```bash
# coze/.env
VITE_BOT_ID=your_bot_id_here
VITE_API_KEY=your_api_key_here
```

## 📚 学习目标

通过这些项目，你可以学习到：

- ✅ Vue 3 Composition API 的使用
- ✅ TypeScript 类型安全的实践
- ✅ Vite 现代化构建工具的使用
- ✅ pnpm 包管理器的最佳实践
- ✅ AI API 集成和错误处理
- ✅ 响应式设计和用户体验优化
- ✅ 代码规范和项目结构组织

## 🎯 项目特点

### 代码质量

- 完整的 TypeScript 类型支持
- ESLint 代码规范检查
- 现代化的 Vue 3 开发模式
- 清晰的项目结构和组件分离

### 用户体验

- 精确到毫秒的时间显示
- 优雅的加载状态和错误处理
- PC 端优化的界面设计
- 流畅的动画和过渡效果

### 开发体验

- 热模块替换（HMR）
- 类型检查和自动补全
- 优化的构建配置
- 统一的包管理器配置

## 📖 学习建议

### 前置知识

- HTML/CSS/JavaScript 基础
- ES6+ 语法特性
- Vue.js 基础概念

### 学习路径

1. 先熟悉 Vue 3 和 TypeScript 基础
2. 理解 Vite 的工作原理
3. 学习 pnpm 包管理器的使用
4. 实践 AI API 的集成
5. 优化用户体验和代码质量

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这些学习项目！

## 📄 许可证

本项目仅供学习参考，请勿用于商业用途。

## 🔗 相关资源

- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Vite 文档](https://vitejs.dev/)
- [pnpm 文档](https://pnpm.io/)
- [Coze API 文档](https://www.coze.com/docs/developer_guides/api_overview)

---

> 💡 **提示**: 这些项目主要用于学习前端开发和 AI 应用集成。请根据实际需求调整和优化代码。
