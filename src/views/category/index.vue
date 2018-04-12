<template>
  <main-content
    :cols="cols"
    :get-data="getData"
    :save-order="saveOrder"
    sortable
    row-key="id"
    :page-size="999">
    <el-button
      slot="header"
      icon="el-icon-plus"
      type="primary"
      @click="add">添加</el-button>
    <dialog-category ref="dialog"
      @success="getList"
      :data="current"></dialog-category>
  </main-content>
</template>

<script>
import { delCategory, changeCategory } from '@/api/category'
import del from '@/mixins/del'
import { mapActions } from 'vuex'
import DialogCategory from './dialog-category'

export default {
  name: 'category',
  mixins: [del],
  components: { DialogCategory },
  data () {
    return {
      current: null,
      cols: [
        {
          label: '封面',
          component: 'col-cover'
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
  methods: {
    ...mapActions('category', ['getCategoryList']),
    saveOrder ({ id, order }) {
      return changeCategory(id, { order })
    },
    getData () {
      return this.getCategoryList().then(list => {
        const results = list.slice(0)
        return { results, count: results.length }
      })
    },
    getList () {
      this.$emit('refresh')
    },
    add () {
      this.current = null
      this.$refs.dialog.visible = true
    },
    modify (data) {
      this.current = data
      this.$refs.dialog.visible = true
    },
    delData (data) {
      return delCategory(data.id)
    }
  }
}
</script>
