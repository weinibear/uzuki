<template>
  <component-stat :cols="cols" :get-list="getList">
    <el-form-item v-for="item in filters"
      :label="item.label"
      :key="item.prop">
      <el-select v-model="item.value">
        <el-option v-for="option in item.options"
          :key="option.value"
          :label="option.label"
          :value="option.value"></el-option>
      </el-select>
    </el-form-item>
    <section style="margin: 10px 0;">
      <el-form-item label="搜索">
        <el-input
          @keyup.native.enter="search"
          v-model="inputValue"
          style="width:280px;">
          <el-button slot="append"
            @click="search"
            icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
    </section>

  </component-stat>
</template>

<script>
import { getWorksStats } from '@/api/stats'
import ComponentStat from './component-stat'
import { rankOptions, channelOptions, needPayOptions, endOptions, groupOptions } from '../book/options'
import { mapMutations } from 'vuex'

export default {
  components: { ComponentStat },
  data () {
    const getAllOptions = function (options) {
      return [{ label: '不限', value: undefined }].concat(options)
    }
    const typeOptions = [
      { label: '书籍', value: 'book' },
      { label: '演绘', value: 'game' }
    ]
    const filters = [
      { prop: 'type', options: typeOptions, label: '类型' },
      { prop: 'rank', options: getAllOptions(rankOptions), label: '等级' },
      { prop: 'channel', options: getAllOptions(channelOptions), label: '分区' },
      { prop: 'need_pay', options: getAllOptions(needPayOptions), label: '付费' },
      { prop: 'end', options: getAllOptions(endOptions), label: '完结' },
      { prop: 'group', options: getAllOptions(groupOptions), label: '分组' }
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
            query: { ...vm.$route.query, [this.prop]: val, page: 1 }
          })
        }
      })
    })
    return {
      filters,
      inputValue: '',
      cols: [
        {
          label: '作品ID',
          prop: 'id',
          render: (h, row) => {
            return <el-button type="text" onClick={this.link.bind(this, row)}>{row.id}</el-button>
          }
        },
        { label: '作品名', prop: 'title' },
        { label: '信仰增量', prop: 'belief' },
        { label: '战斗力增量', prop: 'battle' },
        { label: '重石增量', prop: 'gold_add' },
        { label: '轻石增量', prop: 'coin_add' },
        { label: '收藏增量', prop: 'follow_add' },
        { label: '字数增量', prop: 'word_add' },
        { label: '人气增量', prop: 'follow_add' }
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
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push(`/stats/works/${data.id}`)
    },
    search () {
      this.$router.push({
        query: {
          ...this.$route.query,
          q: this.inputValue
        }
      })
    },
    getList (params) {
      const query = {
        ...params,
        ...this.query
      }
      const q = this.$route.query.q
      this.inputValue = q
      if (q) {
        query.title = q
      }
      return getWorksStats(query)
    }
  }
}
</script>
