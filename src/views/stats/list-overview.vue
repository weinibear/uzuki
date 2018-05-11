<template>
  <component-stat :cols="cols" :get-list="getOverviewStats"></component-stat>
</template>

<script>
import { getOverviewStats } from '@/api/stats'
import ComponentStat from './component-stat'

export default {
  components: { ComponentStat },
  data () {
    return {
      cols: [
        {
          label: '时间',
          prop: 'date'
        },
        {
          label: '新增小说',
          prop: 'new_book_count'
        },
        {
          label: '新增演绘',
          prop: 'new_game_count'
        },
        {
          label: '小说更新',
          prop: 'update_book_count'
        },
        {
          label: '重石消费',
          prop: 'gold_add'
        },
        {
          label: '新增订阅(次)',
          prop: 'pur_add'
        },
        {
          label: '新增充值',
          prop: 'recharge_add'
        }
      ]
    }
  },
  methods: {
    getOverviewStats
  }
}
</script>
