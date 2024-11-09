import type { RequestConfig } from '@/api'
import type { AxiosError, AxiosResponse } from 'axios'

// 错误处理方案：错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}

// 与后端约定的响应数据格式
interface ResponseStructure<T = any> {
  code: number | string
  message: string
  success: boolean
  data?: T
  url?: string

  [key: string]: any
}

/**
 * 业务错误处理
 */
function bizErrorHandler(error: any) {
  if (error.info) {
    const { errorMessage, showType } = error.info
    switch (showType) {
      case ErrorShowType.SILENT:
        // do nothing
        break
      case ErrorShowType.WARN_MESSAGE:
        // TODO
        break
      case ErrorShowType.ERROR_MESSAGE:
        // TODO
        break
      case ErrorShowType.NOTIFICATION:
        // TODO
        break
      case ErrorShowType.REDIRECT:
        // TODO
        break
      default:
        // TODO
        console.error(errorMessage)
    }
  }
}

const requestConfig: RequestConfig<ResponseStructure> = {
  errorConfig: {
    // 抛出错误
    errorThrower: (res) => {
      const { success, data, code, message, errorCode, errorMessage, showType } = res
      if (!success) {
        const error: any = new Error(errorMessage || message)
        // 给错误对象挂载自定义属性,表明这是业务层的错误
        error.name = 'BizError'
        error.info = {
          errorCode: errorCode ?? code,
          errorMessage: errorMessage ?? message,
          showType,
          data,
        }
        throw error // 抛出自定义的错误,请求方法中的 .catch 部分会捕获
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts) => {
      if (opts?.skipErrorHandler)
        return
      // 自定义错误的处理
      if (error.name === 'BizError') {
        bizErrorHandler(error)
      }
      else if (error.name === 'AxiosError') {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        const { status, data } = error.response as AxiosResponse
        // TODO 在这里处理HTTP错误
        console.log(status, data)
      }
      else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // error.request 在浏览器中是 XMLHttpRequest 的实例
        // 而在node.js中是 http.ClientRequest 的实例
        // TODO
        console.error('None response! Please retry.')
      }
      else {
        // 发送请求时出了点问题
        // TODO
        console.error('Request error, please retry')
      }
    },
  },
  requestInterceptors: [
    [
      (config) => {
        // 拦截请求配置，进行个性化处理。
        // TODO
        return { ...config }
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      },
    ],
  ],
  // 状态码 2xx 的时候才会进入响应拦截,其他情况已经在请求方法中的.catch部分处理了
  responseInterceptors: [
    (response) => {
      const { data } = response
      // 请求失败
      if (!data.success) {
        requestConfig.errorConfig?.errorThrower?.(data)
      }
      return response
    },
  ],
}

export default requestConfig
