<template>
  <main-content
    :cols="cols"
    :get-data="getData">
    <el-button
      slot="header"
      icon="el-icon-plus"
      type="primary"
      @click="add">添加</el-button>
    <dialog-material-part ref="dialog" @success="getList"></dialog-material-part>
    <dialog-material-bones ref="dialog3" @success="getList"></dialog-material-bones>
  </main-content>
</template>

<script>
import { getMaterialPart, delMaterialPart } from '@/api/yanhui/material'
import del from '@/mixins/del'
import DialogMaterialPart from './dialog-material-part'
import DialogMaterialBones from './dialog-material-bones'

export default {
  mixins: [del],
  components: { DialogMaterialPart, DialogMaterialBones },
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
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const type = +this.$route.params.type
      const parent = this.$route.params.parent
      const params = { offset, limit, parent }
      return getMaterialPart(params, type)
    },
    add () {
      const type = +this.$route.params.type
      if (type === 3) {
        this.$refs.dialog3.visible = true
      } else {
        this.$refs.dialog.visible = true
      }
    },
    delData (data) {
      return delMaterialPart(data.id)
    }
  }
}
</script>
