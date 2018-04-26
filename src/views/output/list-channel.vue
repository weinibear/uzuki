<template>
  <main-content
    :page-size="20"
    :cols="cols"
    :get-data="getData">
    <el-button
      slot="header"
      icon="el-icon-plus"
      type="primary"
      @click="add">添加</el-button>
    <dialog-channel :data="current" ref="dialog" @success="getList"></dialog-channel>
  </main-content>
</template>

<script>
import { delChannel } from '@/api/output'
import { confirm } from '@/utils/confirm'
import { mapActions } from 'vuex'
import DialogChannel from './dialog-channel'

export default {
  components: { DialogChannel },
  data () {
    return {
      current: null,
      cols: [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '名称',
          prop: 'name'
        },
        {
          label: '插图',
          prop: 'illustration',
          render: (h, row) => <span>{row.illustration ? '有' : '无'}</span>
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
    ...mapActions('output', ['getChannelList']),
    getList () {
      this.$emit('refresh')
    },
    getData () {
      return this.getChannelList().then(list => {
        const results = list.slice(0)
        return { results, count: results.length }
      })
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
      return delChannel(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
