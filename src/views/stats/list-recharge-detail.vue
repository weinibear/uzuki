<template>
  <component-stat-detail :cols="cols" :get-list="getList"></component-stat-detail>
</template>

<script>
import { getRechargeStats } from '@/api/stats'
import ComponentStatDetail from './component-stat-detail'

export default {
  components: { ComponentStatDetail },
  data () {
    return {
      cols: [
        {
          label: '时间',
          prop: 'date_time'
        },
        {
          label: '渠道',
          prop: 'reason'
        },
        {
          label: 'UID',
          prop: 'user_id'
        },
        {
          label: '重石',
          prop: 'gold'
        }
      ]
    }
  },
  methods: {
    getList (params) {
      return getRechargeStats(params).then(res => {
        res.result.forEach(val => {
          val.gold = -1 * val.gold
        })
        return res
      })
    }
  }
}
</script>
