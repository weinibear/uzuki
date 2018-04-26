import _unescape from 'lodash/unescape'
import _escape from 'lodash/escape'

export function content2delta (results = []) {
  const content = []
  let temp = ''
  results.forEach(item => {
    if (item.type === 1) {
      if (temp) {
        content.push({
          insert: temp + '\n'
        })
      }
      temp = ''
      content.push({
        insert: {
          image: _escape(item.value) + '-illustration'
        }
      })
    } else {
      temp += (temp.length ? '\n' : '') + _escape(item.value)
    }
  })
  if (temp) {
    content.push({
      insert: temp + '\n'
    })
  }
  return content
}

export function delta2content (ops = []) {
  const result = []
  const MAX_COUNT = 2000
  ops.forEach(v => {
    if (typeof v.insert === 'string') {
      let text = _unescape(v.insert.trim().replace(/\s*\n\s*/g, '\n'))
      while (text.length > MAX_COUNT) {
        const index = text.lastIndexOf('\n', MAX_COUNT)
        result.push({
          type: 0,
          value: text.slice(0, index === -1 ? MAX_COUNT : index)
        })
        text = text.slice(index === -1 ? MAX_COUNT : index + 1)
      }
      if (text) {
        result.push({
          type: 0,
          value: text
        })
      }
    } else if (v.insert && v.insert.image) {
      result.push({
        type: 1,
        value: v.insert.image.replace(/^(https?:)?\/\/[^/]+/, '').replace('-illustration', '')
      })
    }
  })
  return result
}
