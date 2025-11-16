# Monorepo 快速入门

## 🎯 什么是 Monorepo

Monorepo = 单一仓库 + 多个项目

简单来说，就是把多个相关的项目放在同一个文件夹里，用特殊工具统一管理。

## 📁 基本结构

```
my-project/
├── apps/           # 应用程序
│   ├── web/        # 网页应用
│   └── mobile/     # 移动应用
├── packages/       # 共享包
│   ├── ui/         # UI 组件库
│   ├── utils/      # 工具函数
│   └── types/      # 类型定义
├── package.json    # 根配置
└── pnpm-workspace.yaml  # 工作区配置
```

## ⚙️ 工作原理

### 1. 工作区配置

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### 2. 包引用

```json
// packages/utils/package.json
{
  "name": "@my-project/utils",
  "dependencies": {
    "@my-project/types": "workspace:*"  // 引用本地包
  }
}
```

### 3. 使用共享包

```typescript
// apps/web/src/App.ts
import { Button } from '@my-project/ui'
import { formatDate } from '@my-project/utils'
import { User } from '@my-project/types'
```

## 🚀 常用命令

```bash
# 安装所有依赖
pnpm install

# 启动所有应用
pnpm dev

# 构建所有项目
pnpm build

# 只运行特定项目
pnpm --filter @my-project/web dev

# 格式化代码
pnpm format

# 代码检查
pnpm lint
```

## 💡 主要优势

| 传统方式 | Monorepo |
|---------|----------|
| 每个项目独立安装依赖 | 共享依赖，节省空间 |
| 代码需要复制粘贴 | 直接引用，类型安全 |
| 工具配置重复 | 统一配置，一次设置 |
| 版本需要手动同步 | 自动统一管理 |

## 🛠️ 实际例子

### AI-Learning 项目

```
ai-learning/
├── apps/
│   ├── coze/       # Vue 3 AI 助手
│   └── deepseek/   # JavaScript AI 聊天
├── packages/
│   ├── shared-ui/  # 共享 UI 组件
│   ├── shared-utils/ # 工具函数
│   └── shared-types/ # 类型定义
```

### 代码共享

```typescript
// 所有项目都可以使用
import { ChatMessage } from '@ai-learning/shared-types'
import { Button } from '@ai-learning/shared-ui'
import { formatDate } from '@ai-learning/shared-utils'
```

## 📚 学习资源

- [完整文档](./monorepo-guide.md)
- [pnpm 工作区](https://pnpm.io/workspaces)
- [实例项目](../README.md)

---

## 🎯 总结

Monorepo 让多个项目像"一家人"一样协作：

- **共享资源**：组件、工具、类型
- **统一管理**：依赖、构建、规范
- **提升效率**：一次操作，全局生效

适合场景：微前端、组件库、多平台应用等。
