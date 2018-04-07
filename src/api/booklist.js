import request from '@/utils/request'

// 获取书单列表

export function getBooklist (params) {
  return request.get('/favorite/', { params })
}

/**
 * 添加书单
 * @param {*} data { intro, title }
 */
export function addBooklist (data) {
  return request.post('/favorite/', data)
}

// 删除书单
export function delBooklist (id) {
  return request.post(`/favorite/${id}/delete/`)
}

// 修改书单
export function editBooklist (id, data) {
  return request.post(`/favorite/${id}/change/`, data)
}

// 批量添加作品到书单
export function importBooklist (id, data) {
  return request.post(`/favorite/${id}/add/`, data)
}

// 获取书单作品

export function getWorks (id, params) {
  return request.get(`/favorite/${id}/work/`, { params })
}

// 删除书单作品

export function delWork (id) {
  return request.post(`/favorite/item/${id}/delete/`)
}

// 修改书单作品

export function changeWork ({ id, recommend, order }) {
  return request.post(`/favorite/item/${id}/change/`, {
    recommend,
    order
  })
}
