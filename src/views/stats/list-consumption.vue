<template>
  <component-stat :cols="cols" :get-list="getConsumptionStats"></component-stat>
</template>

<script>
import { getConsumptionStats } from '@/api/stats'
import ComponentStat from './component-stat'

export default {
  components: { ComponentStat },
  data () {
    return {
      cols: [
        {
          label: '时间',
          prop: 'date',
          render: (h, row) => {
            const date = row.date.split('-')
            const link = `/stats/consumption/${date[0]}/${date[1]}/${date[2]}`
            return (
              <router-link to={link}>{row.date}</router-link>
            )
          }
        },
        {
          label: '小说打赏(重石)',
          prop: 'book_gold'
        },
        {
          label: '小说订阅(重石)',
          prop: 'book_pur'
        },
        {
          label: '演绘打赏(重石)',
          prop: 'game_gold'
        },
        {
          label: '演绘订阅(重石)',
          prop: 'game_pur'
        }
      ]
    }
  },
  methods: {
    getConsumptionStats
  }
}
</script>
