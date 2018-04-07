
const serialize = function (obj) {
  return JSON.stringify(obj)
}

const deserialize = function (value) {
  let val = ''
  try {
    val = JSON.parse(value)
  } catch (e) {
    val = value
  }
  return val
}

const store = {
  storage: window.localStorage,
  get (key) {
    const data = this.storage.getItem(key)
    return deserialize(data)
  },
  set (key, value) {
    this.storage.setItem(key, serialize(value))
  },
  remove (key) {
    this.storage.removeItem(key)
  },
  clear () {
    this.storage.clear()
  }
}

export default store
