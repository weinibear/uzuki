import request from '@/utils/request'

export function getTopicList (params) {
  return request.get('/obelisk/', { params })
}

export function getTopicDetail (id) {
  return request.get(`/obelisk/${id}/`)
}

export function createTopic (data) {
  return request.post('/obelisk/', data)
}

export function updateTopic (id, data) {
  return request.patch(`/obelisk/${id}/`, data)
}

export function delTopic (id) {
  return request.delete(`/obelisk/${id}/`)
}
