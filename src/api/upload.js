import request from '@/utils/request'

export function uploadImg (file, data = {}) {
  const fd = new window.FormData()
  fd.append('file', file)
  Object.keys(data).forEach(key => {
    fd.append(key, data[key])
  })
  return request.post('/tunnel/', fd)
}
