<template>
  <main-content
    :cols="cols"
    :page-size="100"
    :get-data="getData">
    <el-button
      slot="header"
      icon="el-icon-plus"
      type="primary"
      @click="add">添加</el-button>
  </main-content>
</template>

<script>
import { getTopicList, delTopic, createTopic } from '@/api/topic'
import { confirm } from '@/utils/confirm'
import { mapMutations } from 'vuex'

export default {
  name: 'topic',
  data () {
    return {
      cols: [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '标题',
          prop: 'title'
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
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      return getTopicList({ offset, limit })
    },
    add () {
      this.$prompt('请输入标题', {
        inputValidator: (val) => {
          if (!val || val.trim() === '') {
            return '不能为空...'
          }
          return true
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = 'loading...'
            const title = instance.inputValue.trim()
            const content = JSON.stringify({})
            createTopic({ title, content }).then(() => {
              this.getList()
              done()
            }).finally(() => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
            })
          } else {
            done()
          }
        }
      })
    },
    modify (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push(`/topic/${data.id}`)
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delTopic(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
