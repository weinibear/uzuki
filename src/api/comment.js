import request from '@/utils/request'

export function getBrandList (params) {
  return request.get('/brand/', { params })
}

export function getBrandDetail (id) {
  return request.get(`/brand/${id}/`)
}

export function updateBrand (id, data) {
  return request.patch(`/brand/${id}/`, data)
}

export function getPostList (id, params) {
  return request.get(`/brand/${id}/post_list/`, { params })
}

/**
 * 搜索帖子
 * @param {*} params {title, content, user_id, limit, offset}
 */
export function searchPost (params) {
  return request.get('/post/search/', { params })
}

export function getPostDetail (pid) {
  return request.get(`/post/${pid}/`)
}

export function delPost (id) {
  return request.delete(`/post/${id}/`)
}

/**
 * 置顶
 * @param {*} id
 */
export function topPost (id) {
  return request.post(`/post/${id}/top/`)
}

export function cancelTopPost (id) {
  return request.post(`/post/${id}/cancel_top/`)
}

export function allTopPost (id) {
  return request.post(`/post/${id}/all_top/`)
}

export function cancelAllTopPost (id) {
  return request.post(`/post/${id}/cancel_all_top/`)
}

export function lockPost (id) {
  return request.post(`/post/${id}/lock/`)
}

export function unlockPost (id) {
  return request.post(`/post/${id}/unlock/`)
}

/**
 * 获取回复列表
 * @param {*} id
 * @param {*} params
 */
export function getReplyList (id, params) {
  return request.get(`/post/${id}/thread/`, { params })
}

/**
 * 搜索回复
 * @param {*} params { content, user_id }
 */
export function searchReply (params) {
  return request.get('/thread/search/', { params })
}

export function getReplyDetail (tid) {
  return request.get(`/thread/${tid}/`)
}

export function delReply (id) {
  return request.delete(`/thread/${id}/`)
}

/**
 * 获取举报列表
 * @param {*} params
 */
export function getReportList (params) {
  return request.get('/report/', { params })
}

export function delReport (id) {
  return request.delete(`/report/${id}/`)
}

export function getTagList (params) {
  return request.get('/tag/', { params })
}

export function createTag (data) {
  return request.post('/tag/', data)
}

export function updateTag (id, data) {
  return request.put(`/tag/${id}/`, data)
}

export function delTag (id) {
  return request.delete(`/tag/${id}/`)
}
