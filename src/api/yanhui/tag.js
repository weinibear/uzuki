import request from '@/utils/request'

const usetypeMap = ['bgp', 'role', 'bgm', 'bga']

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
