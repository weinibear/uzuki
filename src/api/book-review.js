import request from '@/utils/request'

export function getBookList (data) {
  const params = { type: 'book', raw_q: '', need_approval: 1, ...data }
  return request.get('/kensaku/', { params })
}

export function getChapterList (id, params) {
  return request.get(`/submit/book/${id}/chapter_draft/`, {
    params: {
      chapter_need_approval: 1,
      ...params
    }
  })
}

export function approvalBook (action, id, value) {
  return request.post(`/submit/book/${id}/approval_all/`, {
    comment: value,
    action
  })
}

export function approvalChapter (action, id, value) {
  return request.post(`/submit/chapter_draft/${id}/approval/`, {
    comment: value,
    action
  })
}

export function getChapterDraftContent (id) {
  return request.get(`/submit/chapter_draft/${id}/content/`)
}

export function getChapterDraftDetail (id) {
  return request.get(`/submit/chapter_draft/${id}/`)
}

export function getChapterContent (id) {
  return request.get(`/submit/chapter/${id}/content/`)
}

export function getChapterDetail (id) {
  return request.get(`/submit/chapter/${id}/`)
}
