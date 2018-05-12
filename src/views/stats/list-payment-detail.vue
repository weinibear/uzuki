<template>
  <component-stat :cols="cols" :get-list="getList"></component-stat>
</template>

<script>
import { getPaymentStats } from '@/api/stats'
import ComponentStat from './component-stat'

export default {
  components: { ComponentStat },
  data () {
    return {
      cols: [
        {
          label: '时间',
          prop: 'day'
        },
        {
          label: '轻石打赏收入',
          prop: 'coin_add'
        },
        {
          label: '重石打赏收入',
          prop: 'gold_add'
        },
        {
          label: '轻石订阅收入',
          prop: 'coin_income'
        },
        {
          label: '重石订阅收入',
          prop: 'pur_income'
        },
        {
          label: '合计',
          prop: 'total_income'
        }
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
      return getPaymentStats(params)
    }
  }
}
</script>
