import request from '@/utils/request'

export function getRecommendList (offset = 0, limit = 100) {
  const params = { offset, limit }
  return request.get('/pointsrecommend/list_all/', { params })
}

export function addRecompoints (data) {
  return request.post('/pointsrecommend/add/', data)
}

export function editRecompoints (id, data) {
  return request.post(`/pointsrecommend/${id}/modify/`, data)
}

export function delRecompoints (id) {
  return request.post(`/pointsrecommend/${id}/hide/`)
}
