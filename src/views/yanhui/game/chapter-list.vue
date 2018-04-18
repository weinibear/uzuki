<template>
  <main-content
    :cols="cols"
    :get-data="getData">
    <dialog-chapter ref="dialog"
      @success="getList"
      :data="current"></dialog-chapter>
  </main-content>
</template>

<script>
import { getChapterList, withdrawChapter } from '@/api/yanhui/game'
import { chapterStatusOptions } from './options'
import DialogChapter from './dialog-chapter'

export default {
  components: { DialogChapter },
  data () {
    return {
      current: null,
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
            return (
              <div>
                <el-button type="info" plain>预览</el-button>
                <el-button plain onClick={this.modify.bind(this, row)}>修改</el-button>
                <el-button type="danger" plain onClick={this.withdraw.bind(this, row)}>下架</el-button>
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
      const gid = this.$route.params.gid
      const params = {
        offset,
        limit
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
    }
  }
}
</script>
