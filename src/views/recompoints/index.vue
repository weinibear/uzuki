<template>
  <main-content
    :cols="cols"
    :get-data="getData">
    <el-button
      slot="header"
      icon="el-icon-plus"
      type="primary"
      @click="add">添加</el-button>
    <dialog-form
      ref="dialog"
      @success="getList"
      :data="current"></dialog-form>
  </main-content>
</template>

<script>
import { getRecommendList, delRecompoints } from '@/api/recompoints'
import { status, areas } from './options'
import DialogForm from './dialog-recompoints'
import { confirm } from '@/utils/confirm'

export default {
  name: 'recompoints',
  components: { DialogForm },
  data () {
    return {
      current: null,
      cols: [
        {
          label: '作品ID',
          prop: 'works_id'
        },
        {
          label: '状态',
          render: (h, row) => {
            const types = ['info', 'success', 'warning']
            return <el-tag type={types[row.status]}>{status[row.status]}</el-tag>
          }
        },
        {
          label: '类型',
          render: (h, row) => {
            const types = ['info', 'success', 'warning', 'danger']
            return <el-tag type={types[row.area_id]}>{areas[row.area_id]}</el-tag>
          }
        },
        {
          label: '操作',
          render: (h, row) => {
            return (
              <div>
                <el-button plain onClick={this.modify.bind(this, row)}>修改</el-button>
                <el-button type="danger" plain onClick={this.del.bind(this, row)}>删除</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      return getRecommendList(offset, limit)
    },
    add () {
      this.current = null
      this.$refs.dialog.visible = true
    },
    modify (data) {
      this.current = data
      this.$refs.dialog.visible = true
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delRecompoints(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
