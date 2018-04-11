<template>
  <div>
    <el-form
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
    <base-table
      :list="list"
      :cols="cols"
      :loading="loading"
      :total="total" ></base-table>
    <dialog-booklist :data="current" ref="dialog" @success="getList"></dialog-booklist>
  </div>
</template>

<script>
import table from '@/mixins/table'
import { getBooklist, delBooklist } from '@/api/booklist'
import DialogBooklist from './dialog-booklist'
import { mapMutations } from 'vuex'

export default {
  name: 'booklist',
  mixins: [table],
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
          return this.options.some(v => v.value === value)
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
          label: '信息',
          width: 60,
          render: (h, row) => {
            const directives = [
              { name: 'popover', arg: 'popover-info' }
            ]
            return (
              <div>
                <el-popover
                  ref="popover-info"
                  placement="left"
                  trigger="hover">
                  <dl>
                    <dt>点击</dt>
                    <dd>{row.views}</dd>
                    <dt>收藏</dt>
                    <dd>{row.follow_count}</dd>
                    <dt>轻石</dt>
                    <dd>{row.coin}</dd>
                    <dt>重石</dt>
                    <dd>{row.gold}</dd>
                    <dt>信仰</dt>
                    <dd>{row.belief}</dd>
                    <dt>战力</dt>
                    <dd>{row.combat}</dd>
                  </dl>
                </el-popover>
                <el-button type="text" {...{directives}}>数据</el-button>
              </div>
            )
          }
        },
        {
          label: '操作',
          width: 350,
          render: (h, row) => {
            return (
              <div>
                <el-button plain type="success" onClick={this.linkWorks.bind(this, row)}>查看作品({row.work_count})</el-button>
                <el-button plain onClick={this.modify.bind(this, row)}>修改</el-button>
                <el-button plain type="primary">批量添加</el-button>
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
    ...mapMutations('app', ['setBreadcrumb']),
    getData ({ offset, limit }) {
      const query = this.query
      const params = {
        offset,
        limit,
        order: query.sort + query.order
      }
      return getBooklist(params).then(data => {
        this.list = data.results
        this.total = data.count
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
    delData (data) {
      return delBooklist(data.id)
    },
    linkWorks (data) {
      this.setBreadcrumb([
        { to: this.$route.fullPath, name: this.$route.name },
        { to: '', name: data.title }
      ])
      this.$router.push({ name: '书单作品', params: { id: data.id } })
    }
  }
}
</script>
