import request from '@/utils/request'

function getMaterialList (options, type = 'image') {
  const params = { accesstype: 0, usetype: 1, offset: 0, limit: 10, ...options }
  const url = type === 'image' ? '/picture/list_pic/' : '/sound/list_void/'
  return request.get(url, { params })
}

function delMaterial (id, type = 'image') {
  return request.post(`/${type === 'image' ? 'picture' : 'sound'}/${id}/hide/`)
}

function uploadMaterial (fd, type = 'image') {
  const url = type === 'image' ? '/pictunnel/' : '/voidtunnel/'
  return request.post(url, fd)
}

function editMaterial (id, fd, type = 'image') {
  const url = type === 'image' ? `/picture/${id}/infochange` : `/sound/${id}/infochange`
  return request.post(url, fd)
}

const getPartUrl = function (type) {
  let url = '/difference_material/'
  if (type === 1) {
    url = '/avtoar_material/'
  }
  return url
}

/**
 * 获取子素材
 * @param {*} params { limit, offset, type, parent }
 */
function getMaterialPart (params) {
  const url = getPartUrl(params.type)
  return request.get(url, { params })
}

function delMaterialPart (id, type) {
  const url = getPartUrl(type)
  return request.delete(`${url}${id}/`)
}

function uploadMaterialPart (fd, type) {
  const url = getPartUrl(type)
  return request.post(`${url}upload/`, fd)
}

export {
  getMaterialList,
  delMaterial,
  uploadMaterial,
  getMaterialPart,
  delMaterialPart,
  uploadMaterialPart,
  editMaterial
}
