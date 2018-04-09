import request from '@/utils/request'

export function getCategoryList (params) {
  return request.get('/category/', { params })
}

export function delCategory (id) {
  return request.delete(`/category/${id}/`)
}

/**
 * 修改分类
 * @param {*} id
 * @param {*} data { name, order, cover }
 */
export function changeCategory (id, data) {
  return request.put(`/category/${id}/`, data)
}

export function addCategory (data) {
  return request.post('/category/', data)
}
