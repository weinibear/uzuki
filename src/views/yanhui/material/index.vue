<template>
  <main-content
    :cols="cols"
    :get-data="getData">
    <el-form
      slot="header"
      inline
      label-suffix="：">
      <el-form-item>
        <el-radio-group v-model="usetype" size="small">
          <el-radio-button
            v-for="(item, key) in useTypes"
            :label="key"
            :key="key">{{item.name}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="add">添加素材</el-button>
      </el-form-item>
    </el-form>
    <dialog-material ref="dialog" :data="current" @success="getList"></dialog-material>
  </main-content>
</template>

<script>
import { getMaterialList, delMaterial } from '@/api/yanhui/material'
import del from '@/mixins/del'
import { useTypes, picTypes } from './options'
import DialogMaterial from './dialog-material'
import { mapMutations } from 'vuex'

export default {
  name: 'material',
  mixins: [del],
  components: { DialogMaterial },
  data () {
    return {
      useTypes,
      current: null,
      cols: [
        {
          label: '名称',
          prop: 'title',
          width: 200,
          render: (h, row) => {
            return row.pic_type
              ? <el-button
                type="text"
                onClick={this.linkPart.bind(this, row)}>{row.title}</el-button>
              : <span>{row.title}</span>
          }
        },
        {
          label: '链接',
          render: (h, row) => {
            const usetype = row.usetype
            const item = useTypes[usetype]
            const image = item.type === 'image'
            return image
              ? <col-cover row={row} col={{ prop: 'link' }} />
              : <a href={row.link} target="_blank">{row.link}</a>
          }
        },
        {
          label: '分类',
          render: (h, row) => {
            return (
              <el-breadcrumb style={{overflow: 'hidden'}}>
                {['taglevel1', 'taglevel2', 'taglevel3'].map(tag => {
                  return <el-breadcrumb-item>{row[tag].name || '无'}</el-breadcrumb-item>
                })}
              </el-breadcrumb>
            )
          }
        },
        {
          label: '图片属性',
          width: 100,
          render: (h, row) => {
            return <span>{picTypes[row.pic_type] || '无'}</span>
          }
        },
        {
          label: '创建时间',
          component: 'col-time',
          width: 150
        },
        {
          label: '角标',
          width: 100,
          render: (h, row) => {
            return row.badge ? <el-tag>{row.badge}</el-tag> : <span>无</span>
          }
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
  computed: {
    usetype: {
      get () {
        const usetype = this.$route.query.usetype
        return useTypes[usetype] ? usetype : Object.keys(useTypes)[0]
      },
      set (val) {
        this.$router.push({
          query: { ...this.$route.query, usetype: val }
        })
      }
    }
  },
  methods: {
    ...mapMutations('app', ['setBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const item = useTypes[this.usetype]
      const params = {
        offset,
        limit,
        usetype: item.value
      }
      return getMaterialList(params, item.type)
    },
    add () {
      this.current = {
        type: this.usetype,
        link: '',
        sourceType: useTypes[this.usetype].type
      }
      this.$refs.dialog.visible = true
    },
    modify (data) {
      this.current = { ...data };
      ['taglevel1', 'taglevel2', 'taglevel3'].forEach(key => {
        this.current[key] = this.current[key].id
      })
      this.current.type = this.current.usetype
      this.current.sourceType = useTypes[this.current.type].type
      this.$refs.dialog.visible = true
    },
    delData (data) {
      const type = useTypes[data.usetype] && useTypes[data.usetype].type
      return delMaterial(data.id, type)
    },
    linkPart (row) {
      this.setBreadcrumb([
        { to: this.$route.fullPath, name: this.$route.name },
        { to: '', name: row.title }
      ])
      this.$router.push({
        name: '演绘子素材',
        params: {
          type: row.pic_type,
          parent: row.id
        }
      })
    }
  }
}
</script>
