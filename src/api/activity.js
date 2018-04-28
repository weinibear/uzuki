import request from '@/utils/request'

export function getActivityList (params) {
  return request.get('/activity/', { params })
}

export function getActivity (id) {
  return request.get(`/activity/${id}/`)
}

export function delActivity (id) {
  return request.delete(`/activity/${id}/`)
}

export function updateActivity (id, data) {
  return request.put(`/activity/${id}/`, data)
}

export function createActivity (data) {
  return request.post('/activity/', data)
}
