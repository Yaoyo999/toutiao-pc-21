// 基于axios的请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
// 非组件中单独使用
import { Message } from 'element-ui'
import router from '@/router/index.js'
const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net',
  // data为最原始的数据，我们可以对其通过json-bigint进行处理
  transformResponse: [function (data) {
    // 为了防止数据不是json格式的jsonbigint会报错我们使用try,catch来进行判断
    try {
    // 是json格式就调用方法解析为js对象后返回
      return JSONbig.parse(data)
    } catch (error) {
      // 不是的原封不动的将原始的数据返回
      return data
    }
  }]
})
// 配置请求拦截器
request.interceptors.request.use(
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 统一配置token
    if (user) {
      // console.log(user)
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
// 配置响应拦截器
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // 任何响应状态2xx的都会经过这里
  // console.log(response)
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // 任何超过2xx的响应状态码都会经过这里
  // console.dir(error) 打印出错误 console.dir(error)
  // 处理公共的状态码
  // if (error.response && error.response.status === 401)
  const status = error.response.status
  if (status === 401) {
    // 401 无效的token 或者没有token，token已过期
    Message.error('无效的token')
    // 跳转至登录页面(有个小问题跳转回登录界面的时候会闪一下我们把无效的user删除就不会闪屏了)
    // 删除无效的user token
    window.localStorage.removeItem('user')
    router.push('/login')
  } else if (status === 403) {
    // 403没有访问权限
    Message.warning('没有访问权限')
  } else if (status === 400) {
    Message.error('请求参数错误，客户端错误')
  } else if (status >= 500) {
    Message.error('服务器端错误')
  }
  return Promise.reject(error)
})

// 导出请求示例
export default request
// http://ttapi.research.itcast.cn/
// http://api-toutiao-web.itheima.net
