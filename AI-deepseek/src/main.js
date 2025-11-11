import './style.css';

// 主应用初始化
class App {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        console.log('🚀 DeepSeek应用已初始化');
        this.updateCopyrightYear();
        this.initTheme();
    }

    bindEvents() {
        // 绑定键盘事件
        this.bindKeyboardEvents();

        // 绑定主题切换事件
        this.bindThemeEvents();

        // 绑定开始对话按钮
        this.bindStartChatButton();

        // 绑定关闭DeepSeek按钮
        this.bindCloseDeepSeekButton();
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', e => {
            // ESC键重置
            if (e.key === 'Escape') {
                this.showToast('🔁 已重置', 'info');
            }
        });
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

    updateCopyrightYear() {
        const yearElement = document.querySelector('.footer p');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            yearElement.textContent = yearElement.textContent.replace(
                '2024',
                currentYear
            );
        }
    }

    // 主题管理功能
    initTheme() {
        // 从本地存储获取用户偏好
        const savedTheme = localStorage.getItem('theme') || 'auto';
        this.setTheme(savedTheme);
    }

    bindThemeEvents() {
        const themeButtons = {
            'theme-light': 'light',
            'theme-dark': 'dark',
            'theme-auto': 'auto',
        };

        Object.entries(themeButtons).forEach(([buttonId, theme]) => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    this.setTheme(theme);
                    this.showToast(
                        `已切换到${this.getThemeName(theme)}主题`,
                        'success'
                    );
                });
            }
        });
    }

    setTheme(theme) {
        // 保存到本地存储
        localStorage.setItem('theme', theme);

        // 更新按钮状态
        this.updateThemeButtons(theme);

        // 应用主题
        this.applyTheme(theme);
    }

    updateThemeButtons(selectedTheme) {
        const themeButtons = document.querySelectorAll('.theme-btn');
        themeButtons.forEach(button => {
            button.classList.remove('active');
        });

        const activeButton = document.getElementById(`theme-${selectedTheme}`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    applyTheme(theme) {
        const html = document.documentElement;

        // 移除现有主题类
        html.classList.remove('theme-light', 'theme-dark');

        if (theme === 'auto') {
            // 跟随系统偏好
            this.applySystemTheme();
        } else {
            // 应用指定主题
            html.classList.add(`theme-${theme}`);
        }
    }

    applySystemTheme() {
        const html = document.documentElement;
        const prefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)'
        ).matches;

        if (prefersDark) {
            html.classList.add('theme-dark');
        } else {
            html.classList.add('theme-light');
        }

        // 监听系统主题变化
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', e => {
                if (localStorage.getItem('theme') === 'auto') {
                    if (e.matches) {
                        html.classList.add('theme-dark');
                        html.classList.remove('theme-light');
                    } else {
                        html.classList.add('theme-light');
                        html.classList.remove('theme-dark');
                    }
                }
            });
    }

    getThemeName(theme) {
        const names = {
            light: '亮色',
            dark: '暗色',
            auto: '系统',
        };
        return names[theme] || theme;
    }

    // 开始对话功能
    bindStartChatButton() {
        const startChatButton = document.getElementById('start-chat-btn');
        if (startChatButton) {
            startChatButton.addEventListener('click', () => {
                this.startDeepSeekChat();
            });
        }
    }

    async startDeepSeekChat() {
        try {
            // 隐藏开始对话按钮，显示DeepSeek卡片和关闭按钮
            const startButton = document.getElementById('start-chat-btn');
            const deepseekCard = document.getElementById('deepseek-card');
            const closeButton = document.getElementById('close-deepseek-btn');

            if (startButton) {
                startButton.style.display = 'none';
            }
            if (deepseekCard) {
                deepseekCard.style.display = 'block';
            }
            if (closeButton) {
                closeButton.style.display = 'block';
            }

            // 加载DeepSeek脚本
            await this.loadDeepSeekScript();
            this.showToast('🤖 开始与AI对话', 'success');
        } catch (error) {
            console.error('启动DeepSeek对话失败:', error);
            this.showToast('❌ 启动对话失败', 'error');
        }
    }

    // 加载DeepSeek脚本
    async loadDeepSeekScript() {
        try {
            // 检查是否已经加载过
            if (window.deepseekLoaded) {
                return;
            }

            // 导入DeepSeek模块
            const deepseekModule = await import('./deepseek.js');
            // 初始化DeepSeekChat
            deepseekModule.initDeepSeekChat();
            window.deepseekLoaded = true;
            this.showToast('✅ DeepSeek脚本加载成功', 'success');
        } catch (error) {
            console.error('DeepSeek脚本加载失败:', error);
            this.showToast('❌ DeepSeek脚本加载失败', 'error');
            throw error;
        }
    }

    // 绑定关闭DeepSeek按钮
    bindCloseDeepSeekButton() {
        const closeButton = document.getElementById('close-deepseek-btn');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideDeepSeek();
            });
        }
    }

    // 隐藏DeepSeek页面
    hideDeepSeek() {
        const deepseekCard = document.getElementById('deepseek-card');
        const closeButton = document.getElementById('close-deepseek-btn');
        const startButton = document.getElementById('start-chat-btn');

        if (deepseekCard) {
            deepseekCard.style.display = 'none';
        }
        if (closeButton) {
            closeButton.style.display = 'none';
        }
        if (startButton) {
            startButton.style.display = 'block';
        }

        // 重置回复内容
        const replyElement = document.getElementById('reply');
        if (replyElement) {
            replyElement.innerHTML = '<p>点击开始对话后，AI将开始思考...</p>';
        }

        this.showToast('👋 对话已关闭', 'info');
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }

  .start-chat-btn {
    transition: all 0.3s ease;
  }

  .start-chat-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
  }

  .deepseek-card {
    animation: fadeIn 0.5s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);

// 全局应用实例
let app = null;

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
});

// 添加性能监控
if (import.meta.env.DEV) {
    console.log('🔧 开发模式：热重载已启用');
}
