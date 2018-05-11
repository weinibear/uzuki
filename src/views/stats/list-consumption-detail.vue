<template>
  <component-stat-detail :cols="cols" :get-list="getList"></component-stat-detail>
</template>

<script>
import { getConsumptionStats } from '@/api/stats'
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
          label: '金额',
          prop: 'money'
        },
        {
          label: 'UID',
          prop: 'user_id'
        },
        {
          label: '用户名',
          prop: 'user_name'
        },
        {
          label: '消费方式',
          prop: 'con_type'
        },
        {
          label: '原因',
          prop: 'book_title'
        }
      ]
    }
  },
  methods: {
    getList (params) {
      return getConsumptionStats(params)
    }
  }
}
</script>
