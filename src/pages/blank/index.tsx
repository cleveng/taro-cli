import router from '@/router'
import { useAuthStore } from '@/store/modules/auth'
import { useLoad } from '@tarojs/taro'
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    const loggedIn = useAuthStore().loggedIn
    useLoad(() => {
      if (loggedIn) {
        router.switchTab({ url: '/pages/home/index' })
      }
      else {
        router.reLaunch({ url: '/pages/index/index' })
      }
    })
    return null
  },
})
