import request from '@/utils/request'

const usetypeMap = ['bgp', 'role', 'bgm', 'bga', 'item', 'voice']

function parseTags (list) {
  const results = {}
  list.forEach(item => {
    if (!results[usetypeMap[item.usetype]]) {
      results[usetypeMap[item.usetype]] = []
    }
    results[usetypeMap[item.usetype]].push(item)
  })
  return results
}

export function getMaterialTags () {
  return request.get('/mediatag/tagall/')
    .then(parseTags)
}

export function getBadgetag () {
  return request.get('/badgetag/')
}

/**
 * 获取标签列表
 * @param {*} params { groupid, usetype, offset, limit, typeid }
 */
export function getMaterialTagList (params) {
  return request.get('/mediatag/taglist/', { params })
}

/**
 * 添加标签
 * @param {*} data { groupid, usetype, name, order, typeid }
 */
export function addTag (data) {
  return request.post('/mediatag/add/', data)
}

export function modifyTag (id, data) {
  return request.post(`/mediatag/${id}/modify/`, data)
}
