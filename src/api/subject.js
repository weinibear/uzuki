import request from '@/utils/request'

export function getSubjectList (params) {
  return request.get('/n_topic/', { params })
}

export function getSubject (id) {
  return request.get(`/n_topic/${id}/`)
}

export function delSubject (id) {
  return request.delete(`/n_topic/${id}/`)
}

export function updateSubject (id, data) {
  return request.put(`/n_topic/${id}/`, data)
}

export function createSubject (data) {
  return request.post('/n_topic/', data)
}
