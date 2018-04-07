import request from '@/utils/request'

/**
 * 获取推荐列表
 * @param {*} param { offset, limit, type, channel, workType }
 */
export function getRecomList (params) {
  return request.get('/recommend/', { params })
}

export function addRecom (data) {
  return request.post('/recommend/', data)
}

export function editRecom (id, data) {
  return request.put(`/recommend/${id}/`, data)
}

export function delRecom (id) {
  return request.delete(`/recommend/${id}/`)
}
