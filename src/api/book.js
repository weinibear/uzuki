import request from '@/utils/request'

export function getBookList (data) {
  const params = { type: 'book', raw_q: '', source: 1, ...data }
  return request.get('/kensaku/', { params })
}

export function getCategoryList () {
  return request.get('/category/?limit=300&offset=0')
}

export function updateBook (id, data) {
  return request.put(`/book/${id}/`, data)
}

// 渠道上架书籍
export function unbackBook (id) {
  return request.post(`/submit/book/${id}/unback/`)
}

// 下架
export function backBook (id, value) {
  return request.post(`/submit/book/${id}/back/`, { comment: value })
}

export function deleteBook (id) {
  return request.post(`/submit/book/${id}/delete/`)
}

/* 下榜 回榜 */
export function changeRankStatus (id, blackRank) {
  let url = `/book/${id}/regress/` // 回榜
  if (blackRank) {
    url = `/book/${id}/flop/` // 下榜
  }
  return request.post(url)
}

// export function

/* 获取卷列表 */
export function getVolumeList (bookId, offset = 0, limit = 10) {
  const params = { offset, limit }
  return request.get(`submit/book/${bookId}/volume/`, { params })
}

/* 修改卷信息 */
export function updateVolume (volumeId, data) {
  return request.post(`/submit/volume/${volumeId}/change/`, data)
}

/* 删除卷 */

export function deleteVolume (volumeId) {
  return request.post(`/submit/volume/${volumeId}/delete/`)
}

/* 获取章节列表 */
export function getChapterList (volumeId, offset = 0, limit = 10, status = 1) {
  const params = { offset, limit }
  const url = status ? `/submit/volume/${volumeId}/chapter/` : `/submit/volume/${volumeId}/chapter_draft/`
  return request.get(url, { params })
}

/* 删除章节 */

export function deleteChapter (chapterId, status = 1) {
  const url = status ? `/submit/chapter/${chapterId}/delete/` : `/submit/chapter_draft/${chapterId}/delete/`
  return request.post(url)
}

/* 修改章节信息 */
export function updateChapter (chapterId, data, status = 1) {
  const url = status ? `/submit/chapter/${chapterId}/change/` : `/submit/chapter_draft/${chapterId}/change/`
  return request.post(url, data)
}

/* 获取章节内容 */
export function getChapterContent (chapterId, status = 1) {
  let url = status ? `/submit/chapter/${chapterId}/content/` : `/submit/chapter_draft/${chapterId}/content/`
  url += '?offset=0&limit=999'
  return request.get(url)
}

/* 修改章节内容 */
export function updateContent (chapterId, data, status = 1) {
  const url = status ? `/submit/chapter/${chapterId}/content/` : `/submit/chapter_draft/${chapterId}/content/`
  return request.post(url, data)
}
