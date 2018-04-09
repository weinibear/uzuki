<template>
  <div>
    <el-button
      icon="el-icon-plus"
      type="primary"
      @click="add">添加</el-button>
    <btn-sort
      @success="getList"
      :sortable.sync="sortable"
      :list.sync="list"
      :save-order="saveOrder"/>
    <base-table
      :list="list"
      :cols="cols"
      :sortable="sortable"
      :loading="loading"
      :total="total" ></base-table>
    <dialog-category ref="dialog"
      @success="getList"
      :data="current"></dialog-category>
  </div>
</template>

<script>
import { delCategory, changeCategory } from '@/api/category'
import page from '@/mixins/page'
import { mapActions } from 'vuex'
import DialogCategory from './dialog-category'

export default {
  name: 'category',
  mixins: [page],
  components: { DialogCategory },
  data () {
    return {
      list: [],
      total: 0,
      loading: false,
      current: null,
      sortable: false,
      cols: [
        {
          label: '封面',
          component: 'work-cover'
        },
        {
          label: '类名',
          prop: 'name'
        },
        {
          label: '序号',
          prop: 'order'
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
    ...mapActions('category', ['getCategoryList']),
    saveOrder ({ id, order }) {
      return changeCategory(id, { order })
    },
    getList () {
      this.loading = true
      this.getCategoryList().finally(() => {
        this.loading = false
      }).then(list => {
        this.list = list.slice(0)
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
            return delCategory(data.id).finally(() => {
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
