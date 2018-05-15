import request from '@/utils/request'

export function getScreenList () {
  return request.get('/config/splashscreen/screenlist/')
}

export function createScreen (data) {
  return request.post('/config/splashscreen/add/', data)
}

export function updateScreen (data) {
  return request.post('/config/splashscreen/update/', data)
}

export function delScreen (id) {
  return request.post('/config/splashscreen/delete/', { id })
}
