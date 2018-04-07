
const scriptList = []
export function getScript (param) {
  let list = []
  if (typeof param === 'string') {
    list.push(param)
  } else if (Array.isArray(param)) {
    list = param
  }
  const head = document.getElementsByTagName('head')[0]
  const promiseLoad = list.map(src => {
    if (scriptList.indexOf(src) !== -1) return Promise.resolve('loaded')
    return new Promise(function (resolve, reject) {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.charset = 'utf-8'
      script.async = true
      script.src = src
      script.onload = () => {
        scriptList.push(src)
        resolve('loaded')
      }
      script.onerror = err => reject(err)
      head.appendChild(script)
    })
  })
  return Promise.all(promiseLoad)
}

export function combineURLs (baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}

export function formatDate (time, fmt = 'YYYY-MM-DD hh:mm:ss') {
  const date = new Date(time)
  const map = {
    'M+': date.getMonth() + 1, // 月份
    '[Dd]+': date.getDate(), // 日
    '[Hh]+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  let str = fmt.replace(/[Yy]+/g, function (str) {
    return ('' + date.getFullYear()).slice(4 - str.length)
  })
  Object.keys(map).forEach((key) => {
    str = str.replace(new RegExp(key), function (str) {
      const value = '' + map[key]
      return str.length === 1 ? value : ('00' + value).slice(value.length)
    })
  })
  return str
}

export function isValidJSON (value) {
  try {
    JSON.parse(value)
    return true
  } catch (error) {
    console.log(error.toString())
    return false
  }
}

export function formatJSON (content, space = '\t') {
  try {
    let value = JSON.parse(content)
    value = JSON.stringify(value, null, space)
    return value
  } catch (error) {
    console.log(error.toString())
    return content
  }
}
