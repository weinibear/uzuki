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
import download from './download'

export default {
  props: ['cols', 'getList'],
  mixins: [download],
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
    }
  }
}
</script>
