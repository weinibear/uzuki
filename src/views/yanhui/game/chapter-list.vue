<template>
  <main-content
    :cols="cols"
    :get-data="getData">
    <dialog-chapter ref="dialog"
      @success="getList"
      :data="current"></dialog-chapter>
    <dialog-preview ref="dialogPreview"
      :id="currentCid"
      :draft="needApproval"></dialog-preview>
  </main-content>
</template>

<script>
import {
  getChapterList,
  getChapterDraftList,
  withdrawChapter,
  approvalChapter,
  disapprovalChapter
} from '@/api/yanhui/game'
import { chapterStatusOptions } from './options'
import DialogChapter from './dialog-chapter'
import DialogPreview from './dialog-preview'

export default {
  components: { DialogChapter, DialogPreview },
  data () {
    return {
      current: null,
      currentCid: '',
      cols: [
        {
          label: '章节ID',
          prop: 'id',
          width: 100
        },
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '简介',
          prop: 'intro'
        },
        {
          label: '价格',
          prop: 'amount',
          width: 100
        },
        {
          label: '状态',
          width: '90px',
          render: (h, row) => {
            const option = chapterStatusOptions.find(obj => obj.value === row.status) || { tag: '', name: '未知' }
            return <el-tag type={option.tag}>{option.name}</el-tag>
          }
        },
        {
          label: '创建/更新时间',
          component: 'col-time',
          width: 160
        },
        {
          label: '操作',
          width: 300,
          render: (h, row) => {
            const view = ['info', this.view, '预览']
            const withdraw = ['danger', this.withdraw, '下架']
            const modify = ['primary', this.modify, '修改']
            const disapproval = ['danger', this.disapproval, '退回']
            const approval = ['success', this.approval, '通过']
            let children = this.needApproval ? [view, approval, disapproval] : [view, modify, withdraw]
            children = children.map(child => {
              return h('el-button', {
                props: {
                  type: child[0],
                  plain: true
                },
                on: {
                  click: child[1].bind(this, row)
                }
              }, child[2])
            })
            return h('div', children)
          }
        }
      ]
    }
  },
  computed: {
    needApproval () {
      return this.$route.params.type === 'review'
    }
  },
  methods: {
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const gid = this.$route.params.gid
      const params = {
        offset,
        limit
      }
      if (this.needApproval) {
        params.chapter_need_approval = 1
        return getChapterDraftList(gid, params)
      }
      return getChapterList(gid, params)
    },
    withdraw (data) {
      this.$prompt('输入下架理由', '提示', {
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return withdrawChapter(data.id, instance.inputValue).finally(() => {
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
    modify (data) {
      this.current = data
      this.$refs.dialog.visible = true
    },
    add () {
      this.$refs.dialog.visible = true
    },
    review (data, approval = true) {
      let title = '确定要通过吗?'
      let method = approvalChapter
      if (!approval) {
        title = '确定要退回吗?'
        method = disapprovalChapter
      }
      this.$confirm(title, '提示', {
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return method(data.id).finally(() => {
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
    approval (data) {
      this.review(data, true)
    },
    disapproval (data) {
      this.review(data, false)
    },
    view (data) {
      this.currentCid = data.id
      this.$refs.dialogPreview.visible = true
    }
  }
}
</script>
