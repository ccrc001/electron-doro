import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue' // 自动导入vue
import AutoImport from 'unplugin-auto-import/vite' // 自动导入API
import Components from 'unplugin-vue-components/vite' // 自动导入组件
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers' // 自动导入ElementPlus
import Icons from 'unplugin-icons/vite' // 自动导入Icons
import IconsResolver from 'unplugin-icons/resolver' // 自动导入Icons
import path from 'path'
import { loadEnv } from 'vite'

import { viteMockServe } from 'vite-plugin-mock'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export default defineConfig(({ mode }) => {
  // 获取.dev文件的VITE_变量
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, path.resolve(process.cwd(), 'env'), '')
  // console.log(env)

  return {
    main: {
      plugins: [externalizeDepsPlugin(), bytecodePlugin()] // 自动导入依赖
    },
    preload: {
      plugins: [externalizeDepsPlugin(), bytecodePlugin()] // 自动导入依赖
    },
    renderer: {
      envPrefix: 'VITE_',
      envDir: resolve(path.join(__dirname, './env')),
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer/src'),
          '@assets': resolve('src/renderer/src/assets'),
          '@config': resolve('src/renderer/src/config'),
          '@stores': resolve('src/renderer/src/stores'),
          '@router': resolve('src/renderer/src/router'),
          '@utils': resolve('src/renderer/src/utils'),
          '@components': resolve('src/renderer/src/components'),
          '@views': resolve('src/renderer/src/views'),
          '@layouts': resolve('src/renderer/src/layouts'),
          '@api': resolve('src/renderer/src/api')
        }
      },
      server: {
        open: env.VITE_APP_OPEN === 'true', // 是否在开发服务器启动时打开浏览器
        port: Number(env.VITE_APP_PORT) || 3000,
        proxy: {
          [env.VITE_APP_BASE_API]: {
            target: env.VITE_APP_PROXY_TARGET,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      },
      build: {
        sourcemap: env.VITE_APP_SOURCEMAP === 'true',
        minify: env.VITE_APP_COMPRESS === 'true' ? 'esbuild' : false
      },
      plugins: [
        viteMockServe({
          logger: true, // 是否在控制台显示请求日志
          mockPath: 'src/renderer/src/api/mock/modules', // mock文件夹路径
          // ignore: /files|\.d\.ts/, // 忽略 files 文件夹和类型定义文件
          watchFiles: true, // 设置是否监视mockPath对应的文件夹内文件中的更改
          localEnabled: env.VITE_USE_MOCK === 'true', // 根据环境变量决定是否启用
          prodEnabled: env.VITE_USE_MOCK === 'true' // 生产环境根据环境变量决定
          // injectCode 在 Electron 环境中可能不稳定，改用 main.ts 手动调用
          // injectCode: `
          //   import { setupProdMockServer } from '/src/renderer/src/api/mock/mock-prod-server.ts';
          //   setupProdMockServer();
          // `
        }),

        createSvgIconsPlugin({
          iconDirs: [path.resolve(__dirname, './src/renderer/src/assets/icons')],
          symbolId: 'icon-[dir]-[name]', // 注意这里的icon- 前缀我在svgIcon.vue中写死了的，如果调整了记得同步改一下
          // 有特殊需求可不进行该配置
          svgoOptions: {
            // 删除一些填充的属性
            plugins: [
              {
                name: 'removeAttrs',
                params: { attrs: ['class', 'data-name', 'fill', 'stroke'] }
              },
              // 删除样式标签
              'removeStyleElement'
            ]
          }
        }),
        vue(),
        // 自动导入API
        AutoImport({
          resolvers: [
            ElementPlusResolver({
              importStyle: 'sass' // 设置导入样式
            }),
            IconsResolver({
              prefix: 'Icon'
            })
          ], // 自动导入ElementPlus
          imports: [
            'vue',
            'vue-router',
            'pinia',
            'vue-i18n',
            {
              '@utils/cacheUtils': ['cacheUtils'] // import { cacheUtils } from '@utils/cacheUtils'
            }
          ], // 自动导入vue和vue-router和pinia
          dts: 'src/renderer/types/auto-imports.d.ts', // 自动导入的类型定义文件
          vueTemplate: true // 自动导入的模板文件
        }),
        // 自动导入组件
        Components({
          dirs: [resolve('src/renderer/src/components')], // 自动导入组件
          dts: 'src/renderer/types/components.d.ts', // 自动导入的组件类型定义文件
          resolvers: [
            ElementPlusResolver({
              importStyle: 'sass' //设置导入样式
            }),
            IconsResolver({
              enabledCollections: ['ep'], // 自动导入ElementPlus
              customCollections: ['tabler'] // 这里配置组件内需要使用的自定义集合名 https://icon-sets.iconify.design/ 重启自动下载icon
            })
          ] // 自动导入ElementPlus和Icons
        }),
        // 自动导入Icons
        Icons({
          autoInstall: true // 自动安装Icons
        })
      ],
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@use '@assets/variables.scss' as *;` // 引入全局变量文件
          }
        }
      }
    }
  }
})
