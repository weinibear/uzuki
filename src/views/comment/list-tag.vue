<template>
  <main-content
    :cols="cols"
    :get-data="getData"
    :page-size="999">
    <el-button
      slot="header"
      icon="el-icon-plus"
      type="primary"
      @click="add">添加</el-button>
    <dialog-tag ref="dialog"
      @success="getList"
      :data="current"></dialog-tag>
  </main-content>
</template>

<script>
import { mapActions } from 'vuex'
import DialogTag from './dialog-tag'

export default {
  name: 'tag',
  components: { DialogTag },
  data () {
    return {
      current: null,
      cols: [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '内容',
          type: 'value',
          render: (h, row) => {
            return row.type === 1
              ? <img class="img-thumbnail" src={row.value} style="height: 35px"/>
              : <span>{row.value}</span>
          }
        },
        {
          label: '类型',
          prop: 'type',
          render: (h, row) => {
            const tag = row.type === 1
              ? { type: 'success', label: '图片' }
              : { type: '', label: '文字' }
            return <el-tag type={tag.type}>{tag.label}</el-tag>
          }
        },
        {
          label: '操作',
          render: (h, row) => {
            return (
              <div>
                <el-button plain onClick={this.modify.bind(this, row)}>修改</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    ...mapActions('tag', ['getTagList']),
    getData () {
      return this.getTagList().then(list => {
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
    }
  }
}
</script>
