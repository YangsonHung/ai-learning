import { ref } from 'vue'

export function useDeepSeek() {
  const messages = ref([
    {
      role: 'system',
      content: '你是一个乐于助人的AI助手，请用中文回答用户的问题。'
    }
  ])

  const isLoading = ref(false)
  const aiResponse = ref('')
  const userInput = ref('')

  const endpoint = 'https://api.deepseek.com/chat/completions'
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
  }

  const sendMessage = async () => {
    const message = userInput.value.trim()

    if (!message) {
      throw new Error('请输入内容后再发送')
    }

    // 添加用户消息到历史记录
    messages.value.push({ role: 'user', content: message })

    // 清空输入框
    userInput.value = ''

    // 调用API获取回复
    await getAIResponse()
  }

  const getAIResponse = async () => {
    const payload = {
      model: 'deepseek-chat',
      messages: messages.value,
      stream: true, // 启用流式输出
      temperature: 0.7,
      max_tokens: 1000,
    }

    try {
      isLoading.value = true
      aiResponse.value = '🤔 AI正在思考中...'

      // 发送API请求（流式）
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
      }

      // 处理流式响应
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      // 准备回复区域用于流式显示
      aiResponse.value = ''

      // 读取流数据
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // 解码并处理流数据
        const chunk = decoder.decode(value)
        const lines = chunk
          .split('\n')
          .filter(line => line.trim() !== '')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6) // 移除 'data: ' 前缀

            if (data === '[DONE]') {
              // 流式输出完成
              break
            }

            try {
              const jsonData = JSON.parse(data)
              if (
                jsonData.choices &&
                jsonData.choices[0] &&
                jsonData.choices[0].delta
              ) {
                const content = jsonData.choices[0].delta.content
                if (content) {
                  fullResponse += content
                  aiResponse.value = fullResponse
                }
              }
            } catch (e) {
              console.warn('解析流数据失败:', e, '原始数据:', data)
            }
          }
        }
      }

      // 添加AI回复到历史记录
      messages.value.push({ role: 'assistant', content: fullResponse })

    } catch (error) {
      console.error('DeepSeek API调用失败:', error)

      // 显示错误信息
      aiResponse.value = `❌ API调用失败: ${error.message}\n\n请检查网络连接和API密钥配置`
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const resetChat = () => {
    messages.value = [
      {
        role: 'system',
        content: '你是一个乐于助人的AI助手，请用中文回答用户的问题。'
      }
    ]
    aiResponse.value = ''
    userInput.value = ''
    isLoading.value = false
  }

  const formatResponse = (text) => {
    return text.replace(/\n/g, '<br>')
  }

  return {
    messages,
    isLoading,
    aiResponse,
    userInput,
    sendMessage,
    resetChat,
    formatResponse
  }
}