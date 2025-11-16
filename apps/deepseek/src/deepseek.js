// DeepSeek AI助手功能
class DeepSeekChat {
    constructor() {
        this.endpoint = 'https://api.deepseek.com/chat/completions';
        this.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
        };
        this.messages = [
            {
                role: 'system',
                content: '你是一个乐于助人的AI助手，请用中文回答用户的问题。',
            },
        ];
        this.bindEvents();
    }

    bindEvents() {
        const sendButton = document.getElementById('send-message-btn');
        const userInput = document.getElementById('user-input');

        if (sendButton && userInput) {
            // 发送按钮点击事件
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });

            // 回车发送（Ctrl+Enter换行）
            userInput.addEventListener('keydown', e => {
                if (e.key === 'Enter' && !e.ctrlKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    async sendMessage() {
        const userInput = document.getElementById('user-input');
        const message = userInput.value.trim();

        if (!message) {
            this.showToast('请输入内容后再发送', 'error');
            return;
        }

        // 添加用户消息到历史记录
        this.messages.push({ role: 'user', content: message });

        // 清空输入框
        userInput.value = '';

        // 调用API获取回复
        await this.getAIResponse();
    }

    async getAIResponse() {
        const payload = {
            model: 'deepseek-chat',
            messages: this.messages,
            stream: true, // 启用流式输出
            temperature: 0.7,
            max_tokens: 1000,
        };

        try {
            // 显示加载状态
            const loadingElement = document.getElementById('deepseek-loading');
            const replyElement = document.getElementById('reply');

            if (loadingElement) {
                loadingElement.style.display = 'flex';
            }

            if (replyElement) {
                replyElement.innerHTML =
                    '<p style="color: #6b7280;">🤔 AI正在思考中...</p>';
            }

            // 发送API请求（流式）
            const response = await fetch(this.endpoint, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(
                    `API请求失败: ${response.status} ${response.statusText}`
                );
            }

            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let fullResponse = '';

            // 隐藏加载状态
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }

            // 准备回复区域用于流式显示
            if (replyElement) {
                replyElement.innerHTML = `
        <div style="padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #3b82f6; min-height: 100px;">
          <p id="streaming-content" style="margin: 0; line-height: 1.6; white-space: pre-wrap;"></p>
        </div>
      `;
            }

            const streamingElement =
                document.getElementById('streaming-content');

            // 读取流数据
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                // 解码并处理流数据
                const chunk = decoder.decode(value);
                const lines = chunk
                    .split('\n')
                    .filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.substring(6); // 移除 'data: ' 前缀

                        if (data === '[DONE]') {
                            // 流式输出完成
                            break;
                        }

                        try {
                            const jsonData = JSON.parse(data);
                            if (
                                jsonData.choices &&
                                jsonData.choices[0] &&
                                jsonData.choices[0].delta
                            ) {
                                const content =
                                    jsonData.choices[0].delta.content;
                                if (content) {
                                    fullResponse += content;

                                    // 实时更新显示
                                    if (streamingElement) {
                                        streamingElement.textContent =
                                            fullResponse;

                                        // 自动滚动到底部
                                        streamingElement.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'end',
                                        });
                                    }
                                }
                            }
                        } catch (e) {
                            console.warn(
                                '解析流数据失败:',
                                e,
                                '原始数据:',
                                data
                            );
                        }
                    }
                }
            }

            // 添加AI回复到历史记录
            this.messages.push({ role: 'assistant', content: fullResponse });

            // 流式输出完成
            if (replyElement && streamingElement) {
                streamingElement.innerHTML = `
        <div style="line-height: 1.6;">
          ${fullResponse.replace(/\n/g, '<br>')}
        </div>
      `;
            }
        } catch (error) {
            console.error('DeepSeek API调用失败:', error);

            // 隐藏加载状态
            const loadingElement = document.getElementById('deepseek-loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }

            // 显示错误信息
            const replyElement = document.getElementById('reply');
            if (replyElement) {
                replyElement.innerHTML = `
        <div style="background: #fef2f2; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #ef4444;">
          <p style="margin: 0; color: #dc2626;">❌ API调用失败: ${error.message}</p>
          <p style="margin: 0.5rem 0 0 0; color: #6b7280; font-size: 0.875rem;">请检查网络连接和API密钥配置</p>
        </div>
      `;
            }
        }
    }

    showToast(message, type = 'info') {
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;

        document.body.appendChild(toast);

        // 自动移除
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// 初始化DeepSeekChat实例
let deepSeekChat = null;

export function initDeepSeekChat() {
    deepSeekChat = new DeepSeekChat();
}

// 导出sendMessage方法供外部调用
export function sendMessage() {
    if (deepSeekChat) {
        deepSeekChat.sendMessage();
    }
}
