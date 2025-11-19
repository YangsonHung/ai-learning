<script setup>
import { ref, onMounted } from 'vue'
import { useTheme } from './composables/useTheme.js'
import { useToast } from './composables/useToast.js'
import { useDeepSeek } from './composables/useDeepSeek.js'

import './style.css'

const { currentTheme, changeTheme } = useTheme()
const { showToast, showSuccess, showError } = useToast()
const {
  isLoading,
  aiResponse,
  userInput,
  sendMessage,
  resetChat,
  formatResponse
} = useDeepSeek()

const showChat = ref(false)
const currentYear = ref(new Date().getFullYear())

const handleSendMessage = async () => {
  try {
    await sendMessage()
  } catch (error) {
    showError(error.message)
  }
}

const startChat = () => {
  showChat.value = true
  showSuccess('🤖 开始与AI对话')
}

const hideDeepSeek = () => {
  showChat.value = false
  resetChat()
  showToast('👋 对话已关闭', 'info')
}

const handleThemeChange = (theme) => {
  const message = changeTheme(theme)
  showToast(message, 'success')
}

const handleKeyDown = (event) => {
  if (event.key === 'Enter' && !event.ctrlKey) {
    event.preventDefault()
    handleSendMessage()
  }
}

onMounted(() => {
  // ESC键重置
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      showToast('🔁 已重置', 'info')
      if (showChat.value) {
        hideDeepSeek()
      }
    }
  })
})
</script>

<template>
  <div class="app">
    <!-- 导航栏 -->
    <nav class="navbar">
      <div class="nav-container">
        <h1 class="nav-logo">DeepSeek项目</h1>

        <!-- 主题切换按钮 -->
        <div class="theme-switcher">
          <button
            class="theme-btn"
            :class="{ active: currentTheme === 'light' }"
            @click="handleThemeChange('light')"
            aria-label="亮色主题"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="5"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 3v2M12 19v2M3 12h2M19 12h2"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </button>
          <button
            class="theme-btn"
            :class="{ active: currentTheme === 'dark' }"
            @click="handleThemeChange('dark')"
            aria-label="暗色主题"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 3v2M12 19v2M3 12h2M19 12h2"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </button>
          <button
            class="theme-btn"
            :class="{ active: currentTheme === 'auto' }"
            @click="handleThemeChange('auto')"
            aria-label="跟随系统"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="5"
                stroke="currentColor"
                stroke-width="2"
              />
              <path
                d="M12 3v2M5 5l1.5 1.5M19 5l-1.5 1.5M12 19v2M5 19l1.5-1.5M19 19l-1.5-1.5"
                stroke="currentColor"
                stroke-width="2"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main class="main-content">
      <section id="deepseek" class="deepseek-section">
        <div class="container">
          <div class="deepseek-content">
            <h3>🤖 DeepSeek AI 助手</h3>
            <p>与DeepSeek AI进行智能对话</p>

            <button
              v-if="!showChat"
              class="start-chat-btn"
              @click="startChat"
            >
              开始对话
            </button>

            <div
              v-if="showChat"
              class="deepseek-card"
            >
              <div class="deepseek-header">
                <h4>AI回复</h4>
                <div
                  v-if="isLoading"
                  class="loading-indicator"
                >
                  <span class="loading-dot"></span>
                  <span class="loading-dot"></span>
                  <span class="loading-dot"></span>
                </div>
              </div>
              <div class="deepseek-response">
                <div v-if="aiResponse" v-html="formatResponse(aiResponse)"></div>
                <p v-else>点击发送按钮后，AI将开始思考...</p>
              </div>
              <div class="deepseek-input-container">
                <textarea
                  v-model="userInput"
                  class="deepseek-textarea"
                  placeholder="请输入您要与AI对话的内容..."
                  @keydown="handleKeyDown"
                  :disabled="isLoading"
                ></textarea>
                <button
                  @click="handleSendMessage"
                  class="send-message-btn"
                  :disabled="isLoading || !userInput.trim()"
                >
                  发送
                </button>
              </div>
            </div>

            <button
              v-if="showChat"
              class="close-deepseek"
              @click="hideDeepSeek"
            >
              关闭
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; {{ currentYear }} DeepSeek项目. AI助手应用.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 组件特定样式可以在这里添加 */
</style>
