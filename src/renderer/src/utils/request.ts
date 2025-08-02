import axios, { AxiosResponse } from 'axios'

import config from '@config/index'

import { ElMessage, ElMessageBox } from 'element-plus'
import { useLoadingStore } from '@stores/useLoadingStore'
import { cacheUtils } from '@utils/cacheUtils'
const baseURL = config.api
const service = axios.create({
  baseURL,
  timeout: 100000
})

// 请求拦截
service.interceptors.request.use(
  (config) => {
    // 显示加载状态
    const loadingStore = useLoadingStore()
    loadingStore.show()

    if (cacheUtils.get('TOKEN')) {
      // 如果有token，则在请求头中添加Authorization字段
      config.headers['Authorization'] = cacheUtils.get('TOKEN') || ''
      // 这里可以根据实际情况添加其他请求头
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    const loadingStore = useLoadingStore()
    loadingStore.hide()
    ElMessage.error('请求错误')
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 隐藏加载状态
    const loadingStore = useLoadingStore()
    loadingStore.hide()

    const { code, msg } = response.data
    console.log(response.data)

    // 如果响应状态码为200，则返回数据
    if (code === 200) {
      // 这里可以根据实际情况处理响应数据
      // 比如统一处理错误码等

      // ElMessage.success(response.data.data.msg)

      return response.data
    }

    // 响应数据为二进制流处理(Excel导出)
    if (response.data instanceof ArrayBuffer) {
      return response
    }
    // if (code !== 200) {
    //   ElMessage.error(response.data.data.msg)
    // }
    
   
    // ElMessage.error(msg || '系统出错');
    return Promise.reject(new Error(msg || 'Error'))
  },
  (error) => {
    // 隐藏加载状态
    const loadingStore = useLoadingStore()
    loadingStore.hide()

    if (error.response?.data) {
      const { code, msg } = error.response.data
      // token 过期,重新登录
      if (code === 'A0230') {
        ElMessageBox.confirm('当前页面已失效，请重新登录', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          localStorage.clear()
          window.location.href = '/'
        })
      } else {
        ElMessage.error(msg || '系统出错')
      }
    }
    return Promise.reject(error.message)
  }
)

export default service
