<template>
  <component-stat :cols="cols" :get-list="getList"></component-stat>
</template>

<script>
import { getWorksStats } from '@/api/stats'
import ComponentStat from './component-stat'

export default {
  components: { ComponentStat },
  data () {
    return {
      cols: [
        { label: '时间', prop: 'date' },
        { label: '作品ID', prop: 'id' },
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
    id () {
      return this.$route.params.id
    }
  },
  methods: {
    getList (params) {
      params.id = this.id
      params.page = undefined
      return getWorksStats(params)
    }
  }
}
</script>
