<template>
  <main-content
    :cols="cols"
    :get-data="getData">
    <div slot="header">
      <el-button
        icon="el-icon-plus"
        type="primary"
        @click="addData">添加数据</el-button>
      <el-button
        icon="el-icon-plus"
        type="primary"
        @click="addUser">伪造用户({{userCount}})</el-button>
      <el-button @click="getList">刷新</el-button>
    </div>
    <dialog-forged ref="dialogForged" :data="current" @success="getList"></dialog-forged>
    <dialog-user ref="dialogUser" @success="getUserCount"></dialog-user>
  </main-content>
</template>

<script>
import { getTaskList, deleteTask, getForgeUserCount } from '@/api/forgeddata'
import { confirm } from '@/utils/confirm'
import { operations, statusOptions } from './options'
import DialogForged from './dialog-forged'
import DialogUser from './dialog-user'

export default {
  name: 'forgeddata',
  components: { DialogForged, DialogUser },
  data () {
    return {
      current: null,
      userCount: 0,
      cols: [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '目标ID',
          prop: 'target'
        },
        {
          label: '类型',
          render: (h, row) => {
            const option = operations.find(obj => obj.value === row.operation) || { tag: '', label: '未知' }
            return <el-tag type={option.tag}>{option.label}</el-tag>
          }
        },
        {
          label: '进度',
          render: (h, row) => <span>{row.done / row.amount * 100 + '%'}</span>
        },
        {
          label: '状态',
          render: (h, row) => {
            const option = statusOptions.find(obj => obj.value === row.operation) || { tag: '', label: '未知' }
            return <el-tag type={option.tag}>{option.label}</el-tag>
          }
        },
        {
          label: '更新时间',
          component: 'col-time'
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
  created () {
    this.getUserCount()
  },
  methods: {
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      return getTaskList({offset, limit})
    },
    getUserCount () {
      getForgeUserCount().then(res => {
        this.userCount = res.data || 0
      })
    },
    addData () {
      this.current = null
      this.$refs.dialogForged.visible = true
    },
    addUser () {
      this.$refs.dialogUser.visible = true
    },
    modify (data) {
      this.current = data
      this.$refs.dialogForged.visible = true
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return deleteTask(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
