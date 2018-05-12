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
      downloading: false
    }
  },
  computed: {
    year () {
      return this.$route.params.year
    },
    month () {
      return this.$route.params.month
    },
    day () {
      return this.$route.params.day
    },
    filename () {
      return `${this.$route.name}(${this.year}-${this.month}-${this.day})`
    }
  },
  methods: {
    getData ({ offset, limit }) {
      const page = Math.floor(offset / limit) + 1
      const params = {
        page,
        year: this.year,
        month: this.month,
        day: this.day
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
