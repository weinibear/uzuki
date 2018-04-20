<template>
  <main-content
    :cols="cols"
    :get-data="getData"
    sortable
    :save-order="saveOrder">
    <el-button
      slot="header"
      icon="el-icon-plus"
      type="primary"
      @click="add">批量添加</el-button>
    <dialog-add-works ref="dialog" @success="getList"></dialog-add-works>
  </main-content>
</template>

<script>
import { getWorks, delWork, changeWork } from '@/api/booklist'
import DialogAddWorks from './dialog-add-works'
import { confirm } from '@/utils/confirm'

export default {
  components: { DialogAddWorks },
  data () {
    return {
      current: null,
      cols: [
        {
          label: '作品ID',
          prop: 'work_id',
          width: 100
        },
        {
          label: '类型',
          width: 120,
          render: (h, row) => {
            const workType = row.work_type
            const type = workType === 1 ? 'success' : 'info'
            const text = workType === 1 ? '小说' : '演绘'
            return <el-tag type={type}>{text}</el-tag>
          }
        },
        {
          label: '序号',
          prop: 'order',
          width: 80
        },
        {
          label: '标题',
          render: (h, row) => {
            return <col-title row={row} type={row.work_type === 1 ? 'book' : 'game'}></col-title>
          }
        },
        {
          label: '作者',
          prop: 'author_name'
        },
        {
          label: '推荐词',
          prop: 'recommend'
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
    saveOrder ({ id, order }) {
      return changeWork(id, { order })
    },
    getData ({ offset, limit }) {
      const id = this.$route.params.id
      const params = {
        offset,
        limit
      }
      return getWorks(id, params)
    },
    add () {
      this.$refs.dialog.visible = true
    },
    modify (data) {
      this.$prompt('修改推荐词', '提示', {
        inputType: 'textarea',
        inputValue: data.recommend,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return changeWork(data.id, { recommend: instance.inputValue }).finally(() => {
              instance.confirmButtonLoading = false
            }).then(() => {
              done()
              this.$message.success('success')
              this.getList()
            })
          } else {
            done()
          }
        }
      })
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delWork(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
