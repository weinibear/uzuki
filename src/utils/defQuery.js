export default function (vm, obj, type = 'string') {
  Object.defineProperty(obj, 'value', {
    configurable: true,
    enumerable: true,
    get () {
      let value = vm.$route.query[obj.prop]
      if (type === 'number') {
        value = parseInt(value, 10)
      }
      return obj.options.some(v => v.value === value)
        ? value
        : obj.options[0].value
    },
    set (val) {
      vm.$router.push({
        query: { ...vm.$route.query, [obj.prop]: val, page: 1 }
      })
    }
  })
}
