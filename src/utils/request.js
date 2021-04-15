// 基于axios的请求模块
import axios from 'axios'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})
// 导出请求示例
export default request
