/** @type {import('postcss-load-config').Config} */
import { env } from 'node:process'

const isH5 = env.TARO_ENV === 'h5'

export const plugins = {
  'tailwindcss': {},
  'autoprefixer': {},
  'postcss-rem-to-responsive-pixel': {
    rootValue: 32, // 1rem = 32rpx
    propList: ['*'], // 默认所有属性都转化
    transformUnit: isH5 ? 'px' : 'rpx' // 转化的单位,可以变成 px / rpx
  }
}
