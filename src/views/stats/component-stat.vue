<template>
  <main-content
    ref="table"
    :cols="cols"
    :page-size="50"
    :get-data="getData">
    <el-form
      slot="header"
      inline
      label-suffix="：">
      <slot></slot>
      <el-form-item label="月份">
        <el-date-picker
          v-model="time"
          :picker-options="pickerOptions"
          type="month">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
          icon="el-icon-download"
          :loading="downloading"
          @click="download">导出EXCEL</el-button>
      </el-form-item>
    </el-form>
  </main-content>
</template>

<script>
import export2excel from '@/utils/export2excel'
import { mapLimit } from '@/utils/mapLimit'

export default {
  props: ['cols', 'getList'],
  data () {
    return {
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      downloading: false
    }
  },
  computed: {
    year () {
      return this.$route.query.year || new Date().getFullYear()
    },
    month () {
      return this.$route.query.month || (new Date().getMonth() + 1)
    },
    filename () {
      return `${this.$route.name}(${this.year}-${this.month})`
    },
    time: {
      get () {
        return new Date(+this.year, this.month - 1, 1)
      },
      set (val) {
        this.$router.push({
          query: {
            ...this.$route.query,
            year: val.getFullYear(),
            month: val.getMonth() + 1
          }
        })
      }
    }
  },
  methods: {
    getData ({ offset, limit }) {
      const page = Math.floor(offset / limit) + 1
      const params = {
        page,
        year: this.year,
        month: this.month
      }
      return this.getList(params).then(res => {
        return {
          results: res.result,
          count: res.all_count
        }
      })
    },
    download () {
      const table = this.$refs.table
      this.downloading = true
      let getList
      if (table.total > table.limit) {
        const list = []
        const len = Math.ceil(table.total / table.limit)
        const limit = 50
        for (let i = 0; i < len; i++) {
          list.push({
            offset: (i - 1) * limit,
            limit
          })
        }
        getList = mapLimit(list, this.getData, 10).then(res => {
          return res.reduce((prev, curr) => prev.concat(curr.results), [])
        })
      } else {
        getList = Promise.resolve(table.list)
      }
      getList.then(list => {
        return export2excel(this.cols, list, this.filename)
      }).finally(() => {
        this.downloading = false
      })
    }
  }
}
</script>
