import request from '@/utils/request'

export function getGameList (params) {
  const defaultParams = { offset: 0, limit: 10, type: 'game', raw_q: '', ngame: 1 }
  params = { ...defaultParams, ...params }
  return request.get('/ngame/', { params })
}

/**
 * 修改演绘
 * @param {*} id
 * @param {*} data
 */
export function editGame (id, data) {
  return request.put(`/ngame/${id}/`, data)
}

/**
 * 修改付费状态
 * @param {Number} id
 * @param {Number} needPay [1, 0]
 */
export function editNeedPay (id, needPay) {
  return request.post(`/ngame/${id}/change_status/`, { need_pay: needPay })
}

/**
 * 修改演绘折扣
 * @param {*} id
 * @param {*} discount
 */
export const editDiscount = (id, discount) => {
  return request.post(`/ngame/${id}/change_discount/`, { discount })
}

export const withdrawGame = (id, remark = '') => {
  return request.post(`/ngame/${id}/del_game/`, { remark })
}

/**
 * 获取章节列表
 * @param {Number} gameId
 * @param {Object} params
 */
export function getChapterList (gameId, params) {
  return request.get(`/ngame/${gameId}/chapter/`, { params })
}

/**
 * 获取草稿章节列表
 * @param {*} gameId
 * @param {*} params { offset, limit, chapter_need_approval = 0 }
 */
export function getChapterDraftList (gameId, params) {
  let url = `/ngame/${gameId}/chapter_draft/`
  return request.get(url, { params })
}

export function editChapter (id, data) {
  return request.put(`/nchapter/${id}/`, data)
}

/**
 * 下架
 * @param {*} cid
 * @param {*} remark
 */
export function withdrawChapter (cid, remark = '') {
  return request.post(`/nchapter/${cid}/del_chapter/`, { remark })
}
