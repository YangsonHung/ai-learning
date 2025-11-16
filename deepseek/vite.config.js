import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // 加载环境变量
    const env = loadEnv(mode, process.cwd(), '');

    return {
        // 项目根目录
        root: '.',

        // 构建配置
        build: {
            // 输出目录
            outDir: 'dist',
            // 资源目录
            assetsDir: 'assets',
            // 源代码映射
            sourcemap: mode !== 'production',
            // 最小化配置
            minify: mode === 'production' ? 'esbuild' : false,
            // 分块策略
            rollupOptions: {
                output: {
                    // 代码分割
                    manualChunks: {
                        vendor: ['vue', 'react'], // 如果有的话
                    },
                    // 资源文件命名
                    assetFileNames: 'assets/[name]-[hash][extname]',
                    // 入口文件命名
                    entryFileNames: 'assets/[name]-[hash].js',
                    // 块文件命名
                    chunkFileNames: 'assets/[name]-[hash].js',
                },
            },
        },

        // 开发服务器配置
        server: {
            // 服务器端口
            port: 3000,
            // 自动打开浏览器
            open: true,
            // 启用CORS
            cors: true,
            // 热更新
            hmr: {
                overlay: true,
            },
        },

        // 预览服务器配置
        preview: {
            port: 4173,
            open: true,
        },

        // 插件配置
        plugins: [],

        // 环境变量配置
        define: {
            // 全局常量
            __APP_VERSION__: JSON.stringify(env.npm_package_version || '0.0.0'),
        },

        // 解析配置
        resolve: {
            // 别名配置
            alias: {
                '@': '/src',
                '~': '/src',
            },
            // 扩展名配置
            extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
        },

        // CSS配置
        css: {
            // CSS预处理器配置（如果需要）
            preprocessorOptions: {
                // scss: {
                //   additionalData: `@import "./src/styles/variables.scss";`
                // }
            },
            // CSS模块配置
            modules: {
                scopeBehaviour: 'local',
                localsConvention: 'camelCase',
            },
        },

        // 优化配置
        optimizeDeps: {
            // 预构建的依赖
            include: [],
            // 排除的依赖
            exclude: [],
        },

        // 实验性功能
        experimental: {
            // 响应式预加载
            renderBuiltUrl(filename, { hostType }) {
                if (hostType === 'js') {
                    return {
                        runtime: `window.__assets__ || ${JSON.stringify(filename)}`,
                    };
                }
            },
        },
    };
});
