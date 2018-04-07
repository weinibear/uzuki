<template>
  <div>
    <el-button
      icon="el-icon-plus"
      type="primary"
      @click="add">添加</el-button>
    <base-table
      :list="list"
      :cols="cols"
      :loading="loading"
      :total="total" ></base-table>
  </div>
</template>

<script>
import { getWorks, delWork } from '@/api/booklist'
import page from '@/mixins/page'

export default {
  mixins: [page],
  data () {
    return {
      list: [],
      total: 0,
      loading: false,
      current: null,
      cols: [
        {
          label: '作品ID',
          prop: 'work_id'
        },
        {
          label: '类型',
          render: (h, row) => {
            const workType = row.work_type
            const type = workType === 1 ? 'success' : 'info'
            const text = workType === 1 ? '小说' : '演绘'
            return <el-tag type={type}>{text}</el-tag>
          }
        },
        {
          label: '序号',
          prop: 'order'
        },
        {
          label: '标题',
          render: (h, row) => {
            return <work-title row={row} type={row.work_type === 1 ? 'book' : 'game'}></work-title>
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
  watch: {
    '$route': {
      immediate: true,
      handler: 'getList'
    }
  },
  methods: {
    getList () {
      this.loading = true
      const id = this.$route.params.id
      const params = {
        offset: this.offset,
        limit: this.limit
      }
      return getWorks(id, params).then(data => {
        this.list = data.results
        console.log(this.list)
        this.total = data.count
      }).finally(() => {
        this.loading = false
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
      this.$confirm('确认删除么?', {
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return delWork(data.id).finally(() => {
              instance.confirmButtonLoading = false
            }).then(() => {
              done()
              this.$message.success('删除成功')
              this.getList()
            })
          } else {
            done()
          }
        }
      })
    }
  }
}
</script>
