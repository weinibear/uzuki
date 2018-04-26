import request from '@/utils/request'

/**
 * 获取渠道列表
 */
export function getChannelList () {
  return request.get('/distribute/distribute/?offset=0&limit=999')
}

export function createChannel (data) {
  return request.post('/distribute/distribute/', data)
}

export function updateChannel (id, data) {
  return request.post(`/distribute/distribute/${id}/change/`, data)
}

export function delChannel (id) {
  return request.delete(`/distribute/distribute/${id}/`)
}

/**
 * 获取渠道书籍
 * @param {*} channelId
 * @param {*} params
 */
export function getChannelBooklist (channelId, params) {
  return request.get(`/distribute/distribute/${channelId}/book/`, { params })
}

/**
 * 更新渠道书籍
 * @param {*} id
 * @param {*} data
 */
export function updateChannelBook (id, data) {
  return request.get(`/distribute/book/${id}/`, data)
}

/**
 * 删除书籍
 * @param {*} id
 */
export function delBook (id) {
  return request.delete(`/distribute/book/${id}/`)
}

/**
 * 导入书籍
 * @param {*} channelId
 * @param {*} fd { from: 'online', book_id: '' } | { form: 'text', file: file }
 */
export function importNewBook (channelId, fd) {
  return request.post(`/distribute/distribute/${channelId}/import_book/`, fd)
}

/**
 * 获取卷列表
 * @param {*} id
 * @param {*} params
 */
export function getVolumeList (id, params) {
  return request.get(`/distribute/book/${id}/volume/`, { params })
}

/**
 * 删除卷
 * @param {*} id
 */
export function delVolume (id) {
  return request.post(`/distribute/volume/${id}/delete/`)
}

/**
 * 获取章列表
 * @param {*} id
 * @param {*} params
 */
export function getChapterList (id, params) {
  return request.get(`/distribute/volume/${id}/chapter/`, { params })
}

/**
 * 删除章
 * @param {*} id
 */
export function delChapter (id) {
  return request.delete(`/distribute/chapter/${id}/`)
}

/**
 * 更新章节信息
 * @param {*} id
 * @param {*} data
 */
export function updateChapter (id, data) {
  return request.put(`/distribute/chapter/${id}/`, data)
}

/**
 * 获取章节内容
 * @param {*} id
 */
export function getContent (id) {
  return request.get(`/distribute/chapter/${id}/content/?limit=9999`)
}

/**
 * 更新章节内容
 * @param {*} id
 * @param {*} data
 */
export function updateContent (id, data) {
  return request.post(`/distribute/chapter/${id}/content/`, data)
}
