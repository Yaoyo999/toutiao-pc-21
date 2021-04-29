// 评论请求模块

import request from '@/utils/request'
// 获取评论 注意query参数在axios中写为params
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    params
  })
}

// 修改评论状态
export const changeCommentStatus = (articleId, allowComment) => {
  return request({
    url: '/mp/v1_0/comments/status',
    method: 'PUT',
    params: {
      article_id: articleId
    },
    data: {
      allow_comment: allowComment
    }
  })
}
