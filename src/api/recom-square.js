import request from '@/utils/request'

export function getRecomSquareList (params) {
  return request.get('/climax/', { params })
}

export function createdRecomSquare (data) {
  return request.post('/climax/', data)
}

export function updateRecomSquare (id, data) {
  return request.put(`/climax/${id}/`, data)
}

export function delRecomSquare (id) {
  return request.delete(`/climax/${id}/`)
}
