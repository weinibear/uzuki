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
import DialogMaterialPart from './dialog-material-part'
import DialogMaterialBones from './dialog-material-bones'
import { confirm } from '@/utils/confirm'

export default {
  components: { DialogMaterialPart, DialogMaterialBones },
  data () {
    const urlCols1 = [
      {
        label: '链接',
        prop: 'url',
        component: 'col-cover'
      }
    ]
    const urlCols2 = [
      {
        label: '图片',
        prop: 'picture_url',
        component: 'col-cover'
      },
      {
        label: 'JSON',
        render: (h, row) => <a href={row.json_url} target="_blank">{row.json_url}</a>
      }
    ]
    const urlCols = parseInt(this.$route.params.type, 10) === 3 ? urlCols2 : urlCols1
    return {
      current: null,
      cols: [
        {
          label: '名称',
          prop: 'name'
        },
        ...urlCols,
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
  computed: {
    type () {
      return parseInt(this.$route.params.type, 10)
    },
    bones () {
      return this.type === 3
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
      if (this.bones) {
        this.$refs.dialog3.visible = true
      } else {
        this.$refs.dialog.visible = true
      }
    },
    del (data) {
      confirm({ method: this.delData.bind(this, data) })
    },
    delData (data) {
      return delMaterialPart(data.id, this.type).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
