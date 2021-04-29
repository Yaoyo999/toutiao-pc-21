// 文章请求
import request from '@/utils/request'

// 获取文章的接口函数
export const getArticles = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    params
  })
}

// 获取文章频道的接口函数
export const getChannels = () => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels'
  })
}

// 删除文章
export const getDeleteArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 添加文章
export const getAddArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    // query参数
    params: {
      draft // 是否存为草稿（true 为草稿)
    },
    // body参数
    data
  })
}

// 获取指定文章
export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`
  })
}

// 更新修改指定文章
export const updateArticle = (data, articleId, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft
    },
    data
  })
}

// 上传图片
export const uploadImage = data => {
  // 文件上传类型的 Content-Type 为 multipart/form-data 我们不需要手动去设置zhi需要给data一个FormData对象即可
  return request({
    method: 'POST',
    url: '/mp/v1_0/user/images',
    data
  })
}
