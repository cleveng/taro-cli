import { piniaStorage, StorageSceneKey } from '@/libs'
import { defineStore } from 'pinia'

export interface AuthState {
  loggedIn: boolean
  token: string | null
  app: string | null
  redirect: Redirect | null
}

export interface Redirect {
  url: string
  tab?: boolean
}

export const useAuthStore = defineStore(StorageSceneKey.USER, {
  state: (): AuthState => ({
    loggedIn: false,
    token: null,
    app: null,
    redirect: null
  }),
  getters: {
    getToken(): string {
      return this.token
    }
  },
  actions: {
    setToken(token: string) {
      this.token = token
      this.loggedIn = true
    },
    async logout() {
      this.token = null
      this.loggedIn = false
    },
    setRedirect(value: Redirect) {
      this.redirect = value
    },
    clear() {}
  },
  persist: {
    key: StorageSceneKey.USER,
    // pinia-plugin-persistedstate 插件的默认持久化方案只支持web端，在Taro里使用需要自定义进行覆盖
    storage: piniaStorage
  }
})
