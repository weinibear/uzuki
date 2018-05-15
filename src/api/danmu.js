import request from '@/utils/request'
import qs from 'qs'

export function getDanmuList (params) {
  return request.get('/danmu_manager/', { params })
}

export function delDanmu (data) {
  data.target = 'del'
  return request.post('/danmu_manager/', qs.stringify(data))
}
