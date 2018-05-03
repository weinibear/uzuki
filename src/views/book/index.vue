<template>
  <main-content :cols="cols" :get-data="getData">
    <el-form
      slot="header"
      label-width="60px"
      label-suffix="：">
      <el-form-item label="筛选">
        <el-row :gutter="10">
          <el-col v-for="select in filters"
            :span="Math.floor(24/filters.length)"
            :key="select.prop">
            <el-select v-model="select.value">
              <el-option v-for="option in select.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="排序">
        <el-row :gutter="10">
          <el-col v-for="select in sorts"
            :span="Math.floor(24/filters.length)"
            :key="select.prop">
            <el-select v-model="select.value">
              <el-option v-for="option in select.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"></el-option>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="搜索" style="margin-bottom: 0">
        <el-input
          @keyup.native.enter="search"
          v-model="inputValue"
          style="width:280px;margin-right: 10px">
          <el-select v-model="inputType" slot="prepend" style="width:80px">
            <el-option
              v-for="option in fields"
              :key="option.value"
              :label="option.label"
              :value="option.value"></el-option>
          </el-select>
          <el-button slot="append"
            @click="search"
            icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </main-content>
</template>

<script>
import { getBookList } from '@/api/book'
import { statusOptions, rankOptions, channelOptions, needPayOptions,
  endOptions, blackRankOptions, groupOptions, orderOptions, sortOptions } from './options'

export default {
  data () {
    const getAllOptions = function (options, text) {
      return [{ label: '全部' + text, value: undefined }].concat(options)
    }
    const filters = [
      { prop: 'status', options: getAllOptions(statusOptions, '状态') },
      { prop: 'rank', options: getAllOptions(rankOptions, '等级') },
      { prop: 'channel', options: getAllOptions(channelOptions, '分区') },
      { prop: 'need_pay', options: getAllOptions(needPayOptions, '付费状态') },
      { prop: 'end', options: getAllOptions(endOptions, '连载状态') },
      { prop: 'black_rank', options: getAllOptions(blackRankOptions, '榜单状态') },
      { prop: 'group', options: getAllOptions(groupOptions, '分组') }
    ]
    const sorts = [
      { prop: 'order', options: orderOptions },
      { prop: 'sort', options: sortOptions }
    ]
    const vm = this
    filters.concat(sorts).forEach(obj => {
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
            query: { ...vm.$route.query, [this.prop]: val, page: 1 }
          })
        }
      })
    })
    return {
      filters,
      sorts,
      fields: [
        { label: '标题', value: 'default' },
        { label: 'ID', value: 'id' },
        { label: '作者', value: 'author_name' },
        { label: '出品', value: 'press' }
      ],
      inputValue: '',
      inputType: 'default',
      cols: [
        {
          label: '书籍ID',
          prop: 'id',
          width: 80
        },
        {
          label: '封面',
          width: 120,
          component: 'col-cover'
        },
        {
          label: '标题/作者',
          render: (h, row) => (
            <dl>
              <dt>标题</dt>
              <dd><col-title row={row} type="book"></col-title></dd>
              <dt>作者</dt>
              <dd>{row.author_name}</dd>
            </dl>
          )
        },
        {
          label: '简介',
          render: (h, row) => <div class="intro">{row.intro}</div>
        },
        {
          label: '数据',
          width: 120,
          render: (h, row) => (
            <dl>
              <dt>字数</dt>
              <dd>{row.count}</dd>
              <dt>点击</dt>
              <dd>{row.views}</dd>
              <dt>收藏</dt>
              <dd>{row.follow_count}</dd>
              <dt>轻石</dt>
              <dd>{row.coin}</dd>
              <dt>重石</dt>
              <dd>{row.gold}</dd>
            </dl>
          )
        },
        {
          label: '分类',
          width: 80,
          render: (h, row) => row.categories.map(item => <el-tag>{item.name}</el-tag>)
        },
        {
          label: '排行',
          width: 80,
          render: (h, row) => (
            <dl>
              <dt>本日</dt>
              <dd>{row.day_rank}</dd>
              <dt>本周</dt>
              <dd>{row.week_rank}</dd>
            </dl>
          )
        },
        {
          label: '状态',
          render: (h, row) => {
            const arr = [
              { prop: 'rank', options: rankOptions },
              { prop: 'status', options: statusOptions },
              { prop: 'end', options: endOptions },
              { prop: 'need_pay', options: needPayOptions },
              { prop: 'channel', options: channelOptions }
            ]
            return arr.map(v => {
              const none = { tag: 'danger', label: '未知' }
              const item = v.options.find(obj => String(row[v.prop]) === obj.value) || none
              return <el-tag type={item.tag}>{item.label}</el-tag>
            })
          }
        },
        {
          label: '创建/更新时间',
          width: 140,
          component: 'col-time'
        },
        {
          label: '操作',
          width: 280,
          render: (h, row) => (
            <div>
              <el-button>卷目</el-button>
              <el-button>修改</el-button>
              <el-button>下架</el-button>
              <el-button>删除</el-button>
            </div>
          )
        }
      ]
    }
  },
  computed: {
    query () {
      const result = {
        order: this.sorts[1].value + this.sorts[0].value
      }
      this.filters.forEach(obj => {
        result[obj.prop] = obj.value
      })
      return result
    }
  },
  methods: {
    getData ({offset, limit}) {
      const params = {
        offset,
        limit,
        ...this.query
      }
      this.inputValue = this.$route.query.q || ''
      this.inputType = this.$route.query.field || this.fields[0].value
      if (this.inputValue) {
        params.raw_q = this.inputType + ':' + JSON.stringify(this.inputValue)
      }
      return getBookList(params)
    },
    search () {
      this.$router.push({
        query: {
          ...this.$route.query,
          q: this.inputValue,
          field: this.inputType
        }
      })
    }
  }
}
</script>