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

/**
 * 获取活动作品
 * @param {*} id
 * @param {*} type
 * @param {*} params { offset, limit, work_id, status }
 */
export function getWorkList (id, type, params) {
  const work = type === 1 ? 'book' : 'game'
  return request.get(`/activity/${id}/${work}/`, { params })
}

export function createWork (id, type, workId) {
  return request.post(`activity/${id}/attend/`, { 'work_type': type, 'work_id': workId })
}

export function delWork (id, type, workId) {
  return request.post(`activity/${id}/deactive/`, { 'work_type': type, 'work_id': workId })
}
