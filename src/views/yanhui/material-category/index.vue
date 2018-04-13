<template>
  <main-content
    :cols="cols"
    :page-size="999"
    :get-data="getData">
    <el-form
      slot="header"
      inline
      label-suffix="：">
      <el-form-item>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="add">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="category" size="small">
          <el-radio-button
            v-for="(item, key) in useTypes"
            :label="item.category"
            :key="key">{{item.name}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <dialog-category ref="dialog" :data="current" @success="getList"></dialog-category>
  </main-content>
</template>

<script>
import { getMaterialTagList } from '@/api/yanhui/tag'
import { mapMutations } from 'vuex'
import { useTypes } from '../options'
import DialogCategory from './dialog-category'

const categoryMap = {}
Object.keys(useTypes).forEach(key => {
  const item = useTypes[key]
  categoryMap[item.category] = item
})

export default {
  name: 'material-category',
  components: { DialogCategory },
  data () {
    return {
      useTypes,
      current: null,
      cols: [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '名称',
          render: (h, row) => {
            return (
              row.groupid < 3
                ? <el-button
                  type="text"
                  onClick={this.link.bind(this, row)}>{row.name}</el-button>
                : <span>{row.name}</span>
            )
          }
        },
        {
          label: '级别',
          render: (h, row) => {
            const arr = ['一级分类', '二级分类', '三级分类']
            return <span>{arr[row.groupid - 1]}</span>
          }
        },
        {
          label: '类型',
          width: 100,
          render: (h, row) => {
            return <span>{categoryMap[row.usetype].name}</span>
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
  computed: {
    category: {
      get () {
        const category = parseInt(this.$route.query.category, 10)
        return categoryMap[category] ? category : Object.keys(categoryMap)[0]
      },
      set (val) {
        this.$router.push({
          query: { level: 1, category: val, page: 1 },
          params: { typeid: undefined }
        })
      }
    },
    level () {
      const level = parseInt(this.$route.query.level, 10)
      return (level >= 1 && level <= 3) ? level : 1
    },
    typeid () {
      return this.$route.params.typeid
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    pushRouter (obj) {

    },
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const params = {
        offset,
        limit,
        groupid: this.level,
        usetype: this.category,
        typeid: this.typeid
      }
      return getMaterialTagList(params).then(results => {
        return {
          results,
          count: results.length
        }
      })
    },
    add () {
      this.current = {
        groupid: this.level,
        usetype: this.category,
        typeid: this.typeid || 0
      }
      this.$refs.dialog.visible = true
    },
    modify (data) {
      this.current = data
      this.$refs.dialog.visible = true
    },
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.name })
      this.$router.push({
        params: { typeid: data.id },
        query: { ...this.$route.query, level: data.groupid + 1 }
      })
    }
  }
}
</script>
