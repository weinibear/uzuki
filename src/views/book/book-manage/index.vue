<template>
  <div>
    <el-button>添加</el-button>
    <base-table
      :list="list"
      :cols="cols"
      :loading="loading"
      :total="total" ></base-table>
  </div>
</template>

<script>
import { getBookList } from '@/api/book'
import page from '@/mixins/page'

export default {
  name: 'BookManage',
  mixins: [page],
  data () {
    return {
      list: [],
      total: 0,
      loading: false,
      cols: [
        {
          label: '书籍ID',
          prop: 'id'
        },
        {
          label: '标题',
          component: 'WorkTitle'
        },
        {
          label: '封面',
          component: 'WorkCover'
        },
        {
          label: '作者',
          prop: 'author_name'
        },
        {
          label: '简介',
          prop: 'intro'
        },
        {
          label: '操作',
          render: (h, row) => {
            return (
              <div>
                <el-button onClick={this.modify}>修改</el-button>
                <el-button onClick={this.del}>删除</el-button>
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
      const params = {
        offset: this.offset,
        limit: this.limit
      }
      return getBookList(params).then(data => {
        this.list = data.results
        this.total = data.count
      }).finally(() => {
        this.loading = false
      })
    },
    modify () {},
    del () {}
  }
}
</script>
