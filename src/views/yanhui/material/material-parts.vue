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
    <dialog-material-part ref="dialog" @success="getList"></dialog-material-part>
  </div>
</template>

<script>
import { getMaterialPart, delMaterialPart } from '@/api/yanhui/material'
import table from '@/mixins/table'
import DialogMaterialPart from './dialog-material-part'

export default {
  mixins: [table],
  components: { DialogMaterialPart },
  data () {
    return {
      current: null,
      cols: [
        {
          label: '名称',
          prop: 'name'
        },
        {
          label: '链接',
          prop: 'url',
          component: 'col-cover'
        },
        {
          label: '创建时间',
          component: 'col-time'
        },
        {
          label: '操作',
          render: (h, row) => {
            return (
              <div>
                <el-button type="danger" plain onClick={this.del.bind(this, row)}>删除</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    getData ({ offset, limit }) {
      const type = +this.$route.params.type
      const parent = this.$route.params.parent
      const params = { offset, limit, type, parent }
      return getMaterialPart(params).then(data => {
        this.list = data.results
        this.total = data.count
      })
    },
    add () {
      this.$refs.dialog.visible = true
    },
    delData (data) {
      return delMaterialPart(data.id)
    }
  }
}
</script>
