/* eslint-disable node/prefer-global/process */
import type { UserConfigExport } from '@tarojs/cli'

export default {
  logger: {
    quiet: false,
    stats: true
  },
  plugins: [],
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/api': {
          target: process.env.TARO_APP_API,
          changeOrigin: true,
          pathRewrite: { '^/api': '' }
        }
      }
    }
  }
} satisfies UserConfigExport
