<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式数据
const currentTime = ref<string>(new Date().toLocaleTimeString())
const userInput = ref<string>('')
const isLoading = ref<boolean>(false)
const apiResponse = ref<string>('')

// 调度器清理
let timeoutId: number | null = null

// API 配置
const endpoint = 'https://api.coze.cn/open_api/v2/chat'

// 方法
const updateTime = (): void => {
  currentTime.value = new Date().toLocaleTimeString()
}

// 调用 Coze API 的方法
const callCozeAPI = async (): Promise<void> => {
  if (!userInput.value.trim()) {
    alert('请输入查询内容')
    return
  }

  isLoading.value = true
  apiResponse.value = ''

  try {
    const payload = {
      bot_id: import.meta.env.VITE_BOT_ID,
      user: 'yangson',
      query: userInput.value,
      chat_history: [],
      stream: false,
      custom_variables: {
        prompt: "你是一个AI助手"
      }
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.messages && data.messages.length > 0) {
      apiResponse.value = data.messages[0].content
    } else {
      apiResponse.value = '未收到有效响应'
    }
  } catch (error) {
    console.error('API 调用失败:', error)
    apiResponse.value = `调用失败: ${error instanceof Error ? error.message : '未知错误'}`
  } finally {
    isLoading.value = false
  }
}

const clearChat = (): void => {
  userInput.value = ''
  apiResponse.value = ''
}

// 精确的时间更新调度器
const scheduleNextUpdate = (): void => {
  const now = new Date()
  const millisecondsToNextSecond = 1000 - now.getMilliseconds()

  timeoutId = setTimeout(() => {
    updateTime()
    scheduleNextUpdate() // 递归调用下一次更新
  }, millisecondsToNextSecond)
}

// 生命周期
onMounted(() => {
  updateTime() // 立即更新一次时间
  scheduleNextUpdate() // 开始精确的时间更新
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timeoutId !== null) {
    clearTimeout(timeoutId)
    timeoutId = null
  }
})
</script>

<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
          <h1 class="app-title">AI 助手</h1>
        </div>

        <!-- 时间显示 -->
        <div class="current-time">
          <span class="time-label">当前时间</span>
          <span class="time-value">{{ currentTime }}</span>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="app-main">
      <!-- 欢迎组件 -->
      <section class="welcome-section">
        <div class="welcome-content">
          <h2 class="welcome-title">欢迎使用 AI 助手</h2>
          <p class="welcome-description">
            这是一个智能对话助手，基于先进的 AI 技术，为您提供专业的问答服务
          </p>
        </div>
      </section>

      <!-- AI 聊天界面 -->
      <section class="chat-section">
        <div class="container">
          <div class="chat-container">
            <div class="chat-header">
              <h3 class="chat-title">💬 对话区域</h3>
              <button @click="clearChat" class="clear-button">清空对话</button>
            </div>

            <div class="chat-input-area">
              <div class="input-group">
                <textarea
                  v-model="userInput"
                  placeholder="请输入您的问题..."
                  class="chat-input"
                  rows="4"
                  :disabled="isLoading"
                  @keydown.enter.ctrl="callCozeAPI"
                ></textarea>
                <div class="input-controls">
                  <span class="input-hint">Ctrl + Enter 发送</span>
                  <button
                    @click="callCozeAPI"
                    class="send-button"
                    :disabled="isLoading || !userInput.trim()"
                  >
                    <span v-if="isLoading" class="loading-spinner">⏳</span>
                    <span v-else>发送</span>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="apiResponse" class="chat-response">
              <div class="response-header">
                <h3 class="response-title">🤖 AI 回复：</h3>
                <button @click="clearChat" class="response-close">✕</button>
              </div>
              <div class="response-content">{{ apiResponse }}</div>
            </div>

            <div v-if="isLoading" class="loading-indicator">
              <div class="loading-content">
                <div class="loading-spinner">⏳</div>
                <p>AI 正在思考中，请稍候...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; 2024 AI 助手. 智能对话，精彩生活.</p>
        <div class="footer-links">
          <a href="#" class="footer-link">隐私政策</a>
          <a href="#" class="footer-link">使用条款</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.app-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* 时间显示 */
.current-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.time-label {
  opacity: 0.9;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.time-value {
  font-weight: 700;
  font-family: 'Courier New', monospace;
  font-size: 1.1rem;
  color: #ffffff;
}

/* 主要内容区域 */
.app-main {
  flex: 1;
  background-color: #f8f9fa;
}

.welcome-section {
  background: white;
  padding: 2rem 0;
  border-bottom: 1px solid #e9ecef;
}

.welcome-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
}

.welcome-title {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 2rem;
  font-weight: 600;
}

.welcome-description {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
}

/* 聊天界面 */
.chat-section {
  padding: 2rem 0;
  background-color: #f8f9fa;
  flex: 1;
}

.chat-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e9ecef;
}

.chat-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.chat-title {
  margin: 0;
  color: #495057;
  font-size: 1.2rem;
  font-weight: 600;
}

.clear-button {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-button:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

.chat-input-area {
  padding: 2rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-input {
  flex: 1;
  padding: 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1.05rem;
  resize: vertical;
  min-height: 140px;
  transition: all 0.3s ease;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chat-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.chat-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.input-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input-hint {
  color: #6c757d;
  font-size: 0.9rem;
  font-style: italic;
}

.send-button {
  padding: 0.875rem 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 140px;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.chat-response {
  padding: 0;
  border-top: 1px solid #e9ecef;
}

.response-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
}

.response-title {
  margin: 0;
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
}

.response-close {
  background: none;
  border: none;
  color: #6c757d;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.response-close:hover {
  background-color: #e9ecef;
  color: #495057;
}

.response-content {
  padding: 1.5rem;
  background-color: white;
  white-space: pre-wrap;
  line-height: 1.8;
  font-size: 1rem;
  color: #495057;
  border-left: 4px solid #667eea;
  margin: 0;
}

.loading-indicator {
  padding: 3rem 2rem;
  text-align: center;
  background-color: #f8f9fa;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-indicator .loading-spinner {
  font-size: 2rem;
}

.loading-indicator p {
  margin: 0;
  color: #6c757d;
  font-size: 1.1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 页脚 */
.app-footer {
  background-color: #343a40;
  color: white;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: #adb5bd;
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.9rem;
}

.footer-link:hover {
  color: white;
}

/* PC 端专用样式 - 固定宽度设计 */
@media (min-width: 1200px) {
  .header-content {
    max-width: 1400px;
  }

  .chat-container {
    max-width: 1000px;
  }

  .welcome-content,
  .footer-content {
    max-width: 1400px;
  }
}

@media (min-width: 1600px) {
  .header-content {
    max-width: 1600px;
  }

  .chat-container {
    max-width: 1200px;
  }

  .welcome-content,
  .footer-content {
    max-width: 1600px;
  }

  .chat-input {
    min-height: 150px;
    font-size: 1.1rem;
  }

  .welcome-title {
    font-size: 2.2rem;
  }

  .welcome-description {
    font-size: 1.2rem;
  }
}
</style>