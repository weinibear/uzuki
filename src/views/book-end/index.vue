<template>
  <main-content :cols="cols" :get-data="getData">
  </main-content>
</template>

<script>
import { getApplyEndList, approvalEnd, disapprovalEnd } from '@/api/book-end'
import { mapMutations } from 'vuex'
import { confirm } from '@/utils/confirm'
import bookCols from '../book/book-cols'

export default {
  data () {
    return {
      cols: [
        ...bookCols(this),
        {
          label: '操作',
          width: 400,
          render: (h, row) => (
            <div>
              <el-button plain type="success" onClick={this.accept.bind(this, row)}>通过</el-button>
              <el-button plain type="danger" onClick={this.reject.bind(this, row)}>不通过</el-button>
            </div>
          )
        }
      ]
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({offset, limit}) {
      const params = {
        offset,
        limit
      }
      return getApplyEndList(params).then(res => {
        res.results = res.results.map(v => v.book)
        return res
      })
    },
    accept (row) {
      confirm(this.handleApply.bind(this, row.id, 'accept'), { message: '确认通过请求么?' })
    },
    reject (row) {
      confirm(this.handleApply.bind(this, row.id, 'reject'), { message: '确认拒绝请求么?' })
    },
    handleApply (id, action) {
      return Promise.resolve(
        action === 'accept'
          ? approvalEnd(id)
          : disapprovalEnd(id)
      ).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push(`/book/${data.id}/volumes`)
    }
  }
}
</script>
