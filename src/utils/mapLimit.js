
export function mapLimit (arr, wrap, limit = 10) {
  return new Promise((resolve, reject) => {
    const list = arr.slice(0)
    const length = list.length
    const result = new Array(length)
    let rejected = false
    let dones = 0
    const run = function (index) {
      setTimeout(() => {
        Promise.resolve(wrap(list.shift(), index)).then(res => {
          dones++
          result[index] = res
          if (!rejected) {
            if (list.length) {
              run(length - list.length)
            } else if (dones === length) {
              resolve(result)
            }
          }
        }).catch(err => {
          rejected = true
          reject(err)
        })
      }, 0)
    }
    list.slice(0, limit).forEach((v, i) => {
      run(i)
    })
  })
}
