<template>
  <main-content :cols="cols" :get-data="getData" :page-size="20">
  </main-content>
</template>

<script>
import { getReportList, delReport } from '@/api/comment'
import { confirm } from '@/utils/confirm'

export default {
  data () {
    return {
      cols: [
        {
          label: '内容',
          'min-width': 200,
          render: (h, row) => {
            let name = '回复管理'
            let id = 'thread_id'
            if (row.type === 2) {
              name = '帖子管理'
              id = 'post_id'
            }
            const to = {
              name,
              query: {
                [id]: row.content.id
              }
            }
            return <router-link to={to}>{row.content.content}</router-link>
          }
        },
        {
          label: '类别',
          render: (h, row) => <span>{row.type === 1 ? '回复' : '帖子'}</span>
        },
        {
          label: '次数',
          prop: 'count'
        },
        {
          label: '创建/更新日期',
          component: 'col-time'
        },
        {
          label: '删除',
          width: 100,
          render: (h, row) => <el-button type="danger" onClick={this.del.bind(this, row)}>删除</el-button>
        }
      ]
    }
  },
  methods: {
    getList () {
      this.$emit('refresh')
    },
    getData ({offset, limit}) {
      const params = {
        offset,
        limit
      }
      return getReportList(params)
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delReport(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
