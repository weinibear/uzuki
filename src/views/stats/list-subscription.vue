<template>
  <component-stat :cols="cols" :get-list="getSubscriptionStats"></component-stat>
</template>

<script>
import { getSubscriptionStats } from '@/api/stats'
import ComponentStat from './component-stat'

export default {
  components: { ComponentStat },
  data () {
    return {
      cols: [
        {
          label: '作品ID',
          prop: 'book_id'
        },
        {
          label: '均订次数',
          prop: 'average_count'
        },
        {
          label: '总订次数',
          prop: 'all_count'
        },
        {
          label: '总重石订阅数',
          prop: 'gold_count'
        },
        {
          label: '购书券订阅次数',
          prop: 'other_count'
        }
      ]
    }
  },
  methods: {
    getSubscriptionStats
  }
}
</script>
