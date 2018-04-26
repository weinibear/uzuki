<template>
  <main-content
    :page-size="20"
    :cols="cols"
    :get-data="getData">
  </main-content>
</template>

<script>
import { getChapterList, delChapter, updateChapter } from '@/api/output'
import { confirm } from '@/utils/confirm'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      cols: [
        {
          label: 'ID',
          prop: 'works_id',
          width: 100,
          render: (h, row) => <el-button type="text" onClick={this.link.bind(this, row)}>{row.works_id}</el-button>
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
          label: '类型',
          width: 120,
          render: (h, row) => {
            const type = row.type
            const texts = ['设定章', '免费章节', '付费章节']
            const tags = ['info', '', 'success']
            return <el-tag type={tags[type]}>{texts[type]}</el-tag>
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
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const id = this.$route.params.vid
      const params = {
        offset,
        limit
      }
      return getChapterList(id, params)
    },
    modify (data) {
      this.$prompt('修改标题', '提示', {
        inputValue: data.title,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return updateChapter(data.id, { title: instance.inputValue }).finally(() => {
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
      return delChapter(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push({ name: '渠道章节内容', params: { cid: data.id } })
    }
  }
}
</script>
