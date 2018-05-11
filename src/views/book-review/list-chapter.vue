<template>
  <main-content
    :cols="cols"
    :get-data="getData">
    <dialog-content ref="content" :id="cid" :draft="draft"></dialog-content>
  </main-content>
</template>

<script>
import { getChapterList, approvalChapter } from '@/api/book-review'
import { confirm } from '@/utils/confirm'
import { mapMutations } from 'vuex'
import DialogContent from './dialog-content'

export default {
  components: { DialogContent },
  data () {
    return {
      cid: '',
      draft: true,
      cols: [
        {
          label: '章节ID',
          prop: 'id',
          width: 80
        },
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '作者的话',
          prop: 'whisper'
        },
        {
          label: '字数',
          prop: 'count'
        },
        {
          label: '创建/更新时间',
          component: 'col-time'
        },
        {
          label: 'AI审核结果',
          width: 150,
          render: (h, row) => {
            const results = row.ai_result
            const arr = [
              {
                prop: 'politic',
                text: '涉政'
              },
              {
                prop: 'porn',
                text: '色情'
              },
              {
                prop: 'reaction',
                text: '反动'
              }
            ]
            return arr.map(item => {
              let num = (results.result && results.result[item.prop] * 100) || 0
              num = num.toFixed(2)
              let type = 'success'
              if (num >= 75) {
                type = 'danger'
              } else if (num >= 50) {
                type = 'warning'
              }
              return h('el-popover', {
                props: {
                  content: (results.suspect && results.suspect[item.prop + '_text']) || '空',
                  trigger: 'hover',
                  placement: 'left',
                  width: '200'
                }
              }, [
                h('el-tag', {
                  slot: 'reference',
                  props: {
                    type
                  },
                  style: {
                    margin: '5px'
                  }
                }, item.text + ': ' + num + '%')
              ])
            })
          }
        },
        {
          label: '操作',
          width: 400,
          render: (h, row) => (
            <div>
              <el-button plain
                disabled={!row.target_id}
                onClick={() => {
                  if (row.target_id) {
                    this.draft = false
                    this.cid = row.target_id
                    this.$refs.content.visible = true
                  }
                }}>查看原始内容</el-button>
              <el-button plain
                onClick={() => {
                  this.draft = true
                  this.cid = row.id
                  this.$refs.content.visible = true
                }}>查看更新内容</el-button>
              <el-button plain type="danger" onClick={this.reject.bind(this, row)}>退回</el-button>
              <el-button plain type="success" onClick={this.accept.bind(this, row)}>通过</el-button>
            </div>
          )
        }
      ]
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      return getChapterList(this.id, { offset, limit })
    },
    reject (row) {
      this.$prompt('请输入退回信息', '退回', {
        inputValidator: (val) => {
          if (!val || val.trim() === '') {
            return '给个理由呗...'
          }
          return true
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.approval('reject', row.id, instance.inputValue).finally(() => {
              instance.confirmButtonLoading = false
            }).then(() => {
              done()
            })
          } else {
            done()
          }
        }
      })
    },
    accept (row) {
      confirm(this.approval.bind(this, 'accept', row.id, '通过'), { message: '确定通过么' })
    },
    approval (action, id, value) {
      return approvalChapter(action, id, value).then(() => {
        this.$message.success(action === 'accept' ? '审核通过' : '退回成功')
        this.getList()
      })
    }
  }
}
</script>
