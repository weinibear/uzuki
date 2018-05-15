<template>
  <main-content
    :cols="cols"
    :get-data="getData">
    <div slot="header">
      <el-button
        icon="el-icon-plus"
        type="primary"
        @click="add">添加数据</el-button>
    </div>
    <dialog-screen ref="dialog" :data="current" @success="getList"></dialog-screen>
  </main-content>
</template>

<script>
import { getScreenList, delScreen } from '@/api/splashscreen'
import { confirm } from '@/utils/confirm'
import DialogScreen from './dialog-screen'
import { formatDate } from '@/utils'

export default {
  name: 'splashscreen',
  components: { DialogScreen },
  data () {
    return {
      current: null,
      cols: [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '图片',
          prop: 'image',
          component: 'col-cover'
        },
        {
          label: '状态',
          render: (h, row) => <el-tag type={row.status ? 'success' : 'info'}>{row.status ? '开启' : '关闭'}</el-tag>
        },
        {
          label: '链接',
          render: (h, row) => {
            return row.link
              ? <a href={row.link} target="_blank">{row.link}</a>
              : <span>空</span>
          }
        },
        {
          label: '开始/结束时间',
          render: (h, row) => {
            return (
              <div>
                <div>{formatDate(row.start_time)}</div>
                <div>{formatDate(row.end_time)}</div>
              </div>
            )
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
      return getScreenList({offset, limit}).then(res => {
        return {
          results: res.data,
          count: res.count
        }
      })
    },
    add () {
      this.current = null
      this.$refs.dialog.visible = true
    },
    modify (data) {
      const current = { ...data }
      current.start_time = formatDate(current.start_time)
      current.end_time = formatDate(current.end_time)
      this.current = current
      this.$refs.dialog.visible = true
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delScreen(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
