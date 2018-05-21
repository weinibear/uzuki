import request from '@/utils/request'

export function getBookList (data) {
  const params = { type: 'book', raw_q: '', source: 1, ...data }
  return request.get('/kensaku/', { params })
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

/* 获取卷列表 */
export function getVolumeList (bid, params) {
  return request.get(`submit/book/${bid}/volume/`, { params })
}

/* 修改卷信息 */
export function updateVolume (vid, data) {
  return request.post(`/submit/volume/${vid}/change/`, data)
}

/* 删除卷 */

export function delVolume (vid) {
  return request.post(`/submit/volume/${vid}/delete/`)
}

export function createVolume (bid, data) {
  return request.post('/volume/', {
    ...data,
    status: 0,
    book: `/book/${bid}/`
  })
}

/* 获取章节列表 */
export function getChapterList (vid, params) {
  return request.get(`/submit/volume/${vid}/chapter/`, { params })
}

export function getChapterDraftList (vid, params) {
  return request.get(`/submit/volume/${vid}/chapter_draft/`, { params })
}

/* 删除章节 */

export function delChapter (cid) {
  return request.post(`/submit/chapter/${cid}/delete/`)
}

export function delChapterDraft (cid) {
  return request.post(`/submit/chapter_draft/${cid}/delete/`)
}

/* 修改章节信息 */
export function updateChapter (cid, data) {
  return request.post(`/submit/chapter/${cid}/change/`, data)
}

export function updateChapterDraft (cid, data) {
  return request.post(`/submit/chapter_draft/${cid}/change/`, data)
}

export function createChapter (vid, data) {
  return request.post('/chapter/', {
    ...data,
    volume: `/volume/${vid}/`
  })
}

/* 获取章节内容 */
export function getContent (cid) {
  return request.get(`/submit/chapter/${cid}/content/?offset=0&limit=999`)
}

export function getDraftContent (cid) {
  return request.get(`/submit/chapter_draft/${cid}/content/?offset=0&limit=999`)
}

/* 修改章节内容 */
export function updateContent (cid, data) {
  return request.post(`/submit/chapter/${cid}/content/`, data)
}

export function updateDraftContent (cid, data) {
  return request.post(`/submit/chapter_draft/${cid}/content/`, data)
}

/**
 * 获取书籍来源渠道
 */
export function getSourceList () {
  return request.get('/distribute/aquarius/')
}
