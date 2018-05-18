<template>
  <main-content :cols="cols" :get-data="getData">
    <el-form
      slot="header"
      inline
      label-suffix="：">
      <el-form-item label="排序">
        <el-select v-for="select in filters"
          :key="select.prop"
          v-model="select.value">
          <el-option v-for="option in select.options"
            :key="option.value"
            :label="option.name"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="add">添加</el-button>
      </el-form-item>
    </el-form>
    <dialog-booklist :data="current" ref="dialog" @success="getList"></dialog-booklist>
  </main-content>
</template>

<script>
import { getBooklist, delBooklist } from '@/api/booklist'
import DialogBooklist from './dialog-booklist'
import { mapMutations } from 'vuex'
import { confirm } from '@/utils/confirm'
import { parseCount } from '@/utils/index'

export default {
  name: 'booklist',
  components: { DialogBooklist },
  data () {
    const orderOptions = [
      { name: '更新日期', value: 'updated_time' },
      { name: 'ID', value: 'id' },
      { name: '收藏', value: 'follow_count' }
    ]
    const sortOptions = [
      { name: '降序', value: '-' },
      { name: '升序', value: '' }
    ]
    const filters = [
      { prop: 'order', options: orderOptions },
      { prop: 'sort', options: sortOptions }
    ]
    const vm = this
    filters.forEach(obj => {
      Object.defineProperty(obj, 'value', {
        configurable: true,
        enumerable: true,
        get () {
          const value = vm.$route.query[this.prop]
          return this.options.some(v => String(v.value) === String(value))
            ? value
            : this.options[0].value
        },
        set (val) {
          vm.$router.push({
            query: { ...vm.$route.query, [this.prop]: val }
          })
        }
      })
    })
    return {
      filters,
      current: null,
      cols: [
        {
          label: '书单ID',
          prop: 'id',
          width: 80
        },
        {
          label: '标题',
          type: 'favorite',
          component: 'col-title'
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
          label: '创建/更新时间',
          component: 'col-time',
          width: 160
        },
        {
          label: '数据',
          width: 120,
          render: (h, row) => (
            <dl>
              <dt>点击</dt>
              <dd title={row.views}>{parseCount(row.views)}</dd>
              <dt>收藏</dt>
              <dd title={row.follow_count}>{parseCount(row.follow_count)}</dd>
              <dt>轻石</dt>
              <dd title={row.coin}>{parseCount(row.coin)}</dd>
              <dt>重石</dt>
              <dd title={row.gold}>{parseCount(row.gold)}</dd>
              <dt>信仰</dt>
              <dd title={row.belief}>{parseCount(row.belief)}</dd>
              <dt>战力</dt>
              <dd title={row.combat}>{parseCount(row.combat)}</dd>
            </dl>
          )
        },
        {
          label: '操作',
          width: 350,
          render: (h, row) => {
            return (
              <div>
                <el-button plain type="success" onClick={this.linkWorks.bind(this, row)}>查看作品({row.work_count})</el-button>
                <el-button plain onClick={this.modify.bind(this, row)}>修改</el-button>
                <el-button plain type="danger" onClick={this.del.bind(this, row)}>删除</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    query () {
      const result = {}
      this.filters.forEach(obj => {
        result[obj.prop] = obj.value
      })
      return result
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const query = this.query
      const params = {
        offset,
        limit,
        order: query.sort + query.order
      }
      return getBooklist(params)
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
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delBooklist(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    linkWorks (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push({ name: '书单作品', params: { id: data.id } })
    }
  }
}
</script>
