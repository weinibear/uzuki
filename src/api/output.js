import request from '@/utils/request'

/**
 * 获取渠道书籍
 * @param {*} channelId
 * @param {*} params
 */
export function getChannelBooklist (channelId, params) {
  return request.get(`/distribute/distribute/${channelId}/book/`, { params })
}

/**
 * 获取渠道列表
 */
export function getChannelList () {
  return request.get('/distribute/distribute/')
}

/**
 * 更新渠道书籍
 * @param {*} id
 * @param {*} data
 */
export function updateChannelBook (id, data) {
  return request.get(`/distribute/book/${id}/`, data)
}
