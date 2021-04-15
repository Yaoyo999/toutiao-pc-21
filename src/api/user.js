// 用户请求的模块
import request from '@/utils/request.js'
// 用户登录接口
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}
// 获取用户信息的接口
export const userProfile = () => {
  return request({
    method: 'GET',
    // 后端要求把需要授权的用户身份放到请求头中
    // axios 可以通过headers 选项设置请求头
    url: '/mp/v1_0/user/profile',
    headers: {
      // 属性名和属性值姚根据后台接口的要求
      // 属性名 Authorization
      //  属性值 Bearer空格token数据
      Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTg5MDkxMjYsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.EdKErKDqMc3snkYxqt02jSa8t9G44002yWKY3CMOMJg'
    }
  })
}
