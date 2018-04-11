<template>
  <div>
    <el-form
      inline
      label-suffix="：">
      <el-form-item
        v-for="filter in filters"
        :key="filter.prop"
        :label="filter.label">
        <el-select v-model="filter.value">
          <el-option
            v-for="option in filter.options"
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
        <btn-sort
          @success="getList"
          :sortable.sync="sortable"
          :list.sync="list"
          :save-order="saveOrder"
          :before-sort="beforeSort"/>
      </el-form-item>
    </el-form>
    <base-table
      :list="list"
      :page-size.sync="limit"
      :cols="cols"
      :sortable="sortable"
      row-key="id"
      :loading="loading"
      :total="total" ></base-table>
    <dialog-form ref="dialog"
      :data="current"
      @success="getList"></dialog-form>
  </div>
</template>

<script>
import table from '@/mixins/table'
import { getRecomList, delRecom, editRecom } from '@/api/recommend'
import { recomType, recomChannel, recomWorkType } from './options'
import DialogForm from './dialog-recommend.vue'

const recomWorkTypes = [{ value: undefined, name: '全部' }].concat(recomWorkType)

export default {
  name: 'recommend',
  mixins: [table],
  components: { DialogForm },
  data () {
    const filters = [
      { label: '类型', prop: 'type', options: recomType },
      { label: '分区', prop: 'ch', options: recomChannel },
      { label: '分类', prop: 'wt', options: recomWorkTypes }
    ]
    const vm = this
    filters.forEach(obj => {
      Object.defineProperty(obj, 'value', {
        configurable: true,
        enumerable: true,
        get () {
          const value = parseInt(vm.$route.query[this.prop], 10)
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
      sortable: false,
      cols: [
        {
          label: '封面',
          component: 'col-cover',
          width: '200px'
        },
        {
          label: '序号',
          prop: 'order',
          width: '80px',
          align: 'center'
        },
        {
          label: '作品',
          render: (h, row) => {
            const href = <a href={row.href} target="_blank">{row.href}</a>
            return (
              <dl>
                <dt>ID</dt>
                <dd>{row.work.id}</dd>
                <dt>作品</dt>
                <dd><col-title row={row}/></dd>
                <dt>链接</dt>
                <dd>{row.href ? href : '无'}</dd>
              </dl>
            )
          }
        },
        {
          label: '详情',
          render: (h, row) => {
            return (
              <dl>
                <dt>标题</dt>
                <dd>{row.title}</dd>
                <dt>推荐语</dt>
                <dd>{row.recommend_words}</dd>
              </dl>
            )
          }
        },
        {
          label: '信息',
          render: (h, row) => {
            const types = ['info', 'success', 'warning', 'danger']
            const channel = recomChannel.find(obj => obj.value === row.channel)
            const workType = recomWorkType.find(obj => obj.value === row.work_type)
            const type = recomType.find(obj => obj.value === row.type)
            return (
              <div>
                <el-tag type={types[row.channel % 5]}>{channel ? channel.name : ''}</el-tag>
                <el-tag type={types[row.work_type % 5]}>{workType ? workType.name : ''}</el-tag>
                <el-tag type={types[row.type % 5]}>{type ? type.name : ''}</el-tag>
                <el-tag type={types[row.status % 5]}>{row.status ? '使用中' : '未启用'}</el-tag>
              </div>
            )
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
    query () {
      const result = {}
      this.filters.forEach(obj => {
        result[obj.prop] = obj.value
      })
      return result
    }
  },
  methods: {
    beforeSort () {
      if (this.total > this.list.length) {
        return this.getList(true)
      }
    },
    saveOrder ({ id, order }) {
      return editRecom(id, { order })
    },
    getData ({ offset, limit }, all) {
      const params = {
        offset,
        limit,
        ...this.query
      }
      if (all === true) {
        params.offset = 0
        params.limit = 999
      }
      return getRecomList(params).then(data => {
        this.list = data.results
        this.total = data.count
      })
    },
    add () {
      const query = this.query
      this.current = {
        type: query.type,
        channel: query.ch,
        work_type: query.wt || 1
      }
      if (this.current.type === 12) {
        this.current.work_type = 6
      }
      this.$refs.dialog.visible = true
    },
    modify (data) {
      this.current = data
      this.$refs.dialog.visible = true
    },
    delData (data) {
      return delRecom(data.id)
    }
  }
}
</script>
