import request from '@/utils/request'

export function getTaskList (params) {
  return request.get('/config/forgeddata/', { params })
}

export function createTask (data) {
  return request.post('/config/forgeddata/', data)
}

export function updateTask (id, data) {
  return request.put(`/config/forgeddata/${id}/`, data)
}

export function deleteTask (id) {
  return request.delete(`/config/forgeddata/${id}/`)
}

export function getForgeUserCount () {
  return request.get('/config/forgeddata/forge_user_num/')
}

export function createdUser (data) {
  return request.post('/config/forgeddata/forge_user/', data)
}
