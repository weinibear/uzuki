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
import { getRecomSquareList, delRecomSquare } from '@/api/recom-square'
import { location, locate } from './options'
import DialogForm from './dialog-square'
import { confirm } from '@/utils/confirm'
import { formatDate } from '@/utils/index'

export default {
  name: 'square',
  components: { DialogForm },
  data () {
    return {
      current: null,
      cols: [
        {
          label: '封面',
          component: 'col-cover'
        },
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '链接',
          render: (h, row) => <a href={row.main_url} target="_blank">{row.main_url}</a>
        },
        {
          label: '开始/结束时间',
          render: (h, row) => {
            return (
              <div>
                <div>{formatDate(row.started_time)}</div>
                <div>{formatDate(row.ended_time)}</div>
              </div>
            )
          }
        },
        {
          label: '状态',
          render: (h, row) => {
            return <el-tag type={row.enabled ? 'primary' : 'info'}>{row.enabled ? '启用' : '禁用'}</el-tag>
          }
        },
        {
          label: '类型',
          render: (h, row) => {
            const item = location.find(obj => row.location === obj.value)
            return <el-tag type={item.tag}>{item.label}</el-tag>
          }
        },
        {
          label: '分区',
          render: (h, row) => {
            const item = locate.find(obj => row.locate === obj.value)
            return <el-tag type={item.tag}>{item.label}</el-tag>
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
      return getRecomSquareList({offset, limit})
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
      return delRecomSquare(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
