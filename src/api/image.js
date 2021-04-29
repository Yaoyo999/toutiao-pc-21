// 图片请求模块
// 加载请求素材
import request from '@/utils/request'
export const getImages = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/user/images',
    params
  })
}

// 收藏素材
export const addCollectImage = (imageId, collect) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/user/images/${imageId}`,
    data: {
      collect
    }
  })
}

// 删除图片素材
export const deleteImage = (imageId) => {
  return request({
    url: `/mp/v1_0/user/images/${imageId}`,
    method: 'DELETE'
  })
}
