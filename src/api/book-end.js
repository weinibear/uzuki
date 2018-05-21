import request from '@/utils/request'

export function getApplyEndList (params) {
  return request.get('/submit/book/end_apply/', { params })
}

export function approvalEnd (id) {
  return request.post(`/submit/book/${id}/end/`, { action: 'accept' })
}

export function disapprovalEnd (id) {
  return request.post(`/submit/book/${id}/end/`, { action: 'reject' })
}
