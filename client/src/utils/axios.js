import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router/routes'

const axiosPlugin = axios.create({
  // baseURL: '/', // 因为我本地做了反向代理
  timeout: 10000,
  responseType: 'json',
  withCredentials: true, // 是否允许带 cookie 这些
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  }
})

// 添加响应拦截器
axiosPlugin.interceptors.response.use(
  res => {
    // 对响应数据做些事
    if (res.data && !res.data.success) {
      Message({
        showClose: true,
        message: res.data.error.message.message ? res.data.error.message.message : res.data.error.message,
        type: 'error'
      })
      return Promise.reject(res.data.error.message)
    }
    return res
  },
  error => {
    if (error.response.status === 404) {
      router.push({
        path: '/404'
      })
    }
    if (error.response.status === 500 || error.response.status === 504) {
      router.push({
        path: '/403'
      })
    }
    // 返回 response 里的错误信息
    return Promise.reject(error)
  }
)

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default axiosPlugin
