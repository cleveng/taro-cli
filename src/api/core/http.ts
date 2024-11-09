import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import utils from 'axios/unsafe/utils'
import requestConfig from './config'

type RequestError = AxiosError | Error

/**
 * 请求参数的类型定义
 * @param skipErrorHandler 是否跳过错误处理
 * @param getResponse 是否获取原始ajax响应
 * @param requestInterceptors 局部请求拦截器
 * @param responseInterceptors 局部响应拦截器
 */
interface IRequestOptions extends AxiosRequestConfig {
  /** 是否跳过错误处理 */
  skipErrorHandler?: boolean
  /** 是否获取原始ajax响应 */
  getResponse?: boolean
  /** 局部请求拦截器 */
  requestInterceptors?: IRequestInterceptorTuple[]
  /** 局部响应拦截器 */
  responseInterceptors?: IResponseInterceptorTuple[]

  [key: string]: any
}

/** 基础请求方法的类型定义 */
interface IRequest {
  <T = any>(url: string, opts?: IRequestOptions): Promise<T>
}

/** 上传方法的类型定义 */
interface IUpload {
  <T = any, D = any>(url: string, data: D, opts?: IRequestOptions): Promise<T>
}

interface IErrorHandler {
  (error: RequestError, opts: IRequestOptions): void
}

type MaybePromise<T> = T | Promise<T>

/** 请求拦截器的类型定义 */
type IRequestInterceptor = (
  config: IRequestOptions & InternalAxiosRequestConfig
) => MaybePromise<IRequestOptions & InternalAxiosRequestConfig>

/** 响应拦截器的类型定义 */
type IResponseInterceptor = (response: AxiosResponse) => MaybePromise<AxiosResponse>

/** 错误拦截器的类型定义 */
type IErrorInterceptor = (error: RequestError) => Promise<RequestError>

// 拦截器数组的类型定义
type IRequestInterceptorTuple = [IRequestInterceptor, IErrorInterceptor] | [IRequestInterceptor] | IRequestInterceptor
type IResponseInterceptorTuple =
  | [IResponseInterceptor, IErrorInterceptor]
  | [IResponseInterceptor]
  | IResponseInterceptor

/**
 * 请求实例的扩展配置
 * @param errorConfig.errorHandler 错误处理器
 * @param errorConfig.errorThrower 用来拦截错误重新包装后抛出
 * @param requestInterceptors 全局请求拦截器
 * @param responseInterceptors 全局响应拦截器
 */
interface RequestConfig<T = any> extends AxiosRequestConfig {
  /** 错误处理配置 */
  errorConfig?: {
    errorHandler?: IErrorHandler
    errorThrower?: (res: T) => void
  }
  /** 全局请求拦截器 */
  requestInterceptors?: IRequestInterceptorTuple[]
  /** 全局响应拦截器 */
  responseInterceptors?: IResponseInterceptorTuple[]
}

const singletonEnforcer = Symbol()

class AxiosRequest {
  private readonly service: AxiosInstance
  private config: RequestConfig = {
    // TODO 改成你的基础路径
    baseURL: 'http://localhost:8100',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  }

  constructor(enforcer: any) {
    if (enforcer !== singletonEnforcer) {
      throw new Error('Cannot initialize Axios client single instance')
    }
    this.mergeConfig()
    this.service = axios.create(this.config)
    // 请求拦截
    this.config?.requestInterceptors?.forEach((interceptor) => {
      Array.isArray(interceptor)
        ? this.service.interceptors.request.use(interceptor[0], interceptor[1])
        : this.service.interceptors.request.use(interceptor)
    })
    // 响应拦截
    this.config?.responseInterceptors?.forEach((interceptor) => {
      Array.isArray(interceptor)
        ? this.service.interceptors.response.use(interceptor[0], interceptor[1])
        : this.service.interceptors.response.use(interceptor)
    })
  }

  private static _instance: AxiosRequest

  /**
   * 创建唯一实例
   */
  static get instance() {
    // 如果已经存在实例则直接返回, 否则实例化后返回
    return this._instance || (this._instance = new AxiosRequest(singletonEnforcer))
  }

  /**
   * 基础请求
   * @param url 接口地址
   * @param opts 请求参数
   */
  request: IRequest = async (url: string, opts = { method: 'GET' }) => {
    const { getResponse = false, requestInterceptors, responseInterceptors } = opts
    const { requestInterceptorsToEject, responseInterceptorsToEject } = this.getInterceptorsEject({
      requestInterceptors,
      responseInterceptors
    })
    return new Promise((resolve, reject) => {
      this.service
        .request({ ...opts, url })
        .then((res) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          resolve(getResponse ? res : res.data)
        })
        .catch((error) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          try {
            const handler = this.config?.errorConfig?.errorHandler
            if (handler)
              handler(error, opts)
          }
          catch (e) {
            reject(e)
          }
          finally {
            reject(error) // 如果不想把错误传递到方法调用处的话就去掉这个 finally
          }
        })
    })
  }

  /**
   * 上传
   * @param url 接口地址
   * @param data
   * @param opts 请求参数
   */
  upload: IUpload = async (url: string, data, opts = {}) => {
    opts.headers = opts.headers ?? { 'Content-Type': 'multipart/form-data' }
    const { getResponse = false, requestInterceptors, responseInterceptors } = opts
    const { requestInterceptorsToEject, responseInterceptorsToEject } = this.getInterceptorsEject({
      requestInterceptors,
      responseInterceptors
    })
    return new Promise((resolve, reject) => {
      this.service
        .post(url, data, opts)
        .then((res) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          resolve(getResponse ? res : res.data)
        })
        .catch((error) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          try {
            const handler = this.config?.errorConfig?.errorHandler
            if (handler)
              handler(error, opts)
          }
          catch (e) {
            reject(e)
          }
          finally {
            reject(error) // 如果不想把错误传递到方法调用处的话就去掉这个 finally
          }
        })
    })
  }

  /**
   * 下载
   * @param url 资源地址
   * @param opts 请求参数
   */
  download: IRequest = async (url: string, opts = {}) => {
    opts.responseType = opts.responseType ?? 'blob'
    const { getResponse = false, requestInterceptors, responseInterceptors } = opts
    const { requestInterceptorsToEject, responseInterceptorsToEject } = this.getInterceptorsEject({
      requestInterceptors,
      responseInterceptors
    })
    return new Promise((resolve, reject) => {
      this.service
        .get(url, opts)
        .then((res) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          resolve(getResponse ? res : res.data)
        })
        .catch((error) => {
          this.removeInterceptors({ requestInterceptorsToEject, responseInterceptorsToEject })
          try {
            const handler = this.config?.errorConfig?.errorHandler
            if (handler)
              handler(error, opts)
          }
          catch (e) {
            reject(e)
          }
          finally {
            reject(error) // 如果不想把错误传递到方法调用处的话就去掉这个 finally
          }
        })
    })
  }

  /**
   * 合并请求参数
   */
  private mergeConfig() {
    this.config = utils.merge(this.config, requestConfig)
  }

  /**
   * 收集使用完毕的局部拦截器
   * @param opts
   */
  private getInterceptorsEject(opts: {
    requestInterceptors?: IRequestInterceptorTuple[]
    responseInterceptors?: IResponseInterceptorTuple[]
  }) {
    const { requestInterceptors, responseInterceptors } = opts
    const requestInterceptorsToEject = requestInterceptors?.map((interceptor) => {
      return Array.isArray(interceptor)
        ? this.service.interceptors.request.use(interceptor[0], interceptor[1])
        : this.service.interceptors.request.use(interceptor)
    })
    const responseInterceptorsToEject = (responseInterceptors as IResponseInterceptorTuple[])?.map((interceptor) => {
      return Array.isArray(interceptor)
        ? this.service.interceptors.response.use(interceptor[0], interceptor[1])
        : this.service.interceptors.response.use(interceptor)
    })
    return { requestInterceptorsToEject, responseInterceptorsToEject }
  }

  /**
   * 移除局部拦截器,避免影响其他请求
   * @param opts
   */
  private removeInterceptors(opts: { requestInterceptorsToEject?: number[], responseInterceptorsToEject?: number[] }) {
    const { requestInterceptorsToEject, responseInterceptorsToEject } = opts
    requestInterceptorsToEject?.forEach((interceptor) => {
      this.service.interceptors.request.eject(interceptor)
    })
    responseInterceptorsToEject?.forEach((interceptor) => {
      this.service.interceptors.response.eject(interceptor)
    })
  }
}

const requestInstance = AxiosRequest.instance
const request = requestInstance.request
const upload = requestInstance.upload
const download = requestInstance.download
export { download, request, upload }
export type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  IRequest as Request,
  IRequestOptions as RequestOptions,
  IResponseInterceptor as ResponseInterceptor,
  IUpload as Upload,
  RequestConfig,
  RequestError
}
