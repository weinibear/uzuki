import request from '@/utils/request'
import qs from 'qs'

export function getMessageList (params) {
  return request.get('/message_manager/', { params })
}

export function createMessage (data) {
  data.action = 'add'
  return request.post('/message_manager', qs.stringify(data))
}

export function delMessage (id, type) {
  const data = {
    action: 'del',
    id,
    type
  }
  return request.post('/message_manager', qs.stringify(data))
}
