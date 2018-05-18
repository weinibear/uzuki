<template>
  <main-content
    :cols="cols"
    :get-data="getData"
    row-key="id"
    :page-size="20"
    sortable
    :save-order="saveOrder">
    <el-form
      inline
      slot="header"
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
      </el-form-item>
    </el-form>
    <dialog-form ref="dialog"
      :data="current"
      @success="getList"></dialog-form>
  </main-content>
</template>

<script>
import { getRecomList, delRecom, editRecom } from '@/api/recommend'
import { recomType, recomChannel, recomWorkType } from './options'
import DialogForm from './dialog-recommend.vue'
import { confirm } from '@/utils/confirm'

const recomWorkTypes = [{ value: undefined, name: '全部' }].concat(recomWorkType)

export default {
  name: 'recommend',
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
            let type = 'book'
            if (row.work_type === 2) {
              type = 'play'
            } else if (row.work_type === 6) {
              type = 'favorite'
            }
            return (
              <dl>
                <dt>ID</dt>
                <dd>{row.work.id}</dd>
                <dt>作品</dt>
                <dd><a href={`https://www.iqing.com/${type}/${row.work.id}`} target="_blank">{row.title}</a></dd>
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
                <dd>{row.recommend_words || '无'}</dd>
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
    getList () {
      this.$emit('refresh')
    },
    saveOrder ({ id, order }) {
      return editRecom(id, { order })
    },
    getData ({ offset, limit }) {
      const params = {
        offset,
        limit,
        ...this.query
      }
      return getRecomList(params)
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
      const current = { ...data }
      current.work_id = current.work.id
      this.current = current
      this.$refs.dialog.visible = true
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delRecom(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
