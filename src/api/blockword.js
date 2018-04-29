import request from '@/utils/request'
import qs from 'qs'

export function getBlockwords () {
  return request.post('/shielding', qs.stringify({ action: 'check' }))
}

export function delBlockword (word) {
  return request.post('/shielding', qs.stringify({ action: 'delete', word }))
}

export function createBlockword (word) {
  return request.post('/shielding', qs.stringify({ action: 'add', word }))
}
