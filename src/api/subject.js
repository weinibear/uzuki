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

/**
 * 获取活动作品
 * @param {*} id
 * @param {*} type
 * @param {*} params { offset, limit, work_id, status }
 */
export function getWorkList (id, type, params) {
  const work = type === 1 ? 'book' : 'game'
  return request.get(`/n_topic/${id}/${work}/`, { params })
}

export function createWork (id, type, workId) {
  return request.post(`n_topic/${id}/attend/`, { 'work_type': type, 'work_id': workId })
}

export function delWork (id, type, workId) {
  return request.post(`n_topic/${id}/deactive/`, { 'work_type': type, 'work_id': workId })
}
