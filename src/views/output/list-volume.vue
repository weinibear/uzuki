<template>
  <main-content
    :page-size="20"
    :cols="cols"
    :get-data="getData">
  </main-content>
</template>

<script>
import { getVolumeList, delVolume } from '@/api/output'
import { confirm } from '@/utils/confirm'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      cols: [
        {
          label: 'ID',
          prop: 'works_id',
          render: (h, row) => <el-button type="text" onClick={this.link.bind(this, row)}>{row.works_id}</el-button>,
          width: 100
        },
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '字数',
          prop: 'count'
        },
        {
          label: '日期',
          component: 'col-time'
        },
        {
          label: '状态',
          width: 120,
          render: (h, row) => {
            const status = row.status
            const type = status === 2 ? 'success' : 'info'
            const text = status === 2 ? '可见' : '隐藏'
            return <el-tag type={type}>{text}</el-tag>
          }
        },
        {
          label: '操作',
          render: (h, row) => {
            return (
              <div>
                <el-button type="danger" plain onClick={this.del.bind(this, row)}>删除</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const id = this.$route.params.bid
      const params = {
        offset,
        limit
      }
      return getVolumeList(id, params)
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delVolume(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push({ name: '渠道章节管理', params: { vid: data.id } })
    }
  }
}
</script>
