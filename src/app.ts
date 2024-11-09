import { createApp } from 'vue'

import { setupStore } from './store'

import '@nutui/touch-emulator'

// 引入所有组件的样式文件
import '@nutui/nutui-taro/dist/style.css'
import './app.scss'

const App = createApp({
  onShow(options: Record<string, never>) {
    console.log('App onShow.', options)
  }
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})

function bootstrap() {
  setupStore(App)
}

void bootstrap()

export default App
