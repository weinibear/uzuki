<template>
  <main-content
    :cols="cols"
    :get-data="getData">
    <el-button
      slot="header"
      icon="el-icon-plus"
      type="primary"
      @click="add">添加</el-button>
  </main-content>
</template>

<script>
import { getSubjectList, delSubject } from '@/api/subject'
import { confirm } from '@/utils/confirm'
import { mapMutations } from 'vuex'

export default {
  name: 'activity',
  data () {
    return {
      cols: [
        {
          label: 'ID',
          prop: 'id',
          width: 80
        },
        {
          label: '封面',
          component: 'col-cover',
          width: 320
        },
        {
          label: '标题',
          type: 'subject',
          component: 'col-title'
        },
        {
          label: '序号',
          prop: 'order',
          width: 50
        },
        {
          label: '状态',
          render: (h, row) => {
            const boolText = (bool) => bool ? '开启' : '关闭'
            return (
              <dl>
                <dt>作品区状态</dt>
                <dd>{boolText(row.works_display)}</dd>
                <dt>投稿状态</dt>
                <dd>{boolText(row.submit_enable)}</dd>
                <dt>讨论区状态</dt>
                <dd>{boolText(row.bf_enable)}</dd>
                <dt>活动显示</dt>
                <dd>{boolText(row.enabled)}</dd>
              </dl>
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
                <el-button plain type="info" onClick={this.link.bind(this, row, 1)}>书籍</el-button>
                <el-button plain type="info" onClick={this.link.bind(this, row, 2)}>演绘</el-button>
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
      return getSubjectList({ offset, limit })
    },
    add () {
      this.$router.push('/subject/0')
    },
    modify (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push(`/subject/${data.id}`)
    },
    link (data, type) {
      this.pushBreadcrumb({ to: '', name: data.title })
      const id = data.id
      this.$router.push({
        name: '专题作品',
        params: {
          id,
          type
        }
      })
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delSubject(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
