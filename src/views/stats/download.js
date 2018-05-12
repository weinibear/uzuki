import export2excel from '@/utils/export2excel'
import { mapLimit } from '@/utils/mapLimit'

export default {
  methods: {
    download () {
      const table = this.$refs.table
      this.downloading = true
      let getList
      if (table.total > table.limit) {
        const list = []
        const len = Math.ceil(table.total / table.limit)
        const limit = table.limit
        for (let i = 0; i < len; i++) {
          list.push({
            offset: i * limit,
            limit
          })
        }
        getList = () => {
          return mapLimit(list, this.getData, 10).then(res => {
            return res.reduce((prev, curr) => prev.concat(curr.results), [])
          })
        }
        if (len > 20) {
          getList = () => {
            return this.$confirm('当前数据很多会花费较长时间, 是否继续?').then(getList)
          }
        }
      } else {
        getList = () => {
          return Promise.resolve(table.list)
        }
      }
      getList().then(list => {
        return export2excel(this.cols, list, this.filename)
      }).finally(() => {
        this.downloading = false
      })
    }
  }
}
