<template>
  <component-stat :cols="cols" :get-list="getWithdrawStats"></component-stat>
</template>

<script>
import { getWithdrawStats } from '@/api/stats'
import ComponentStat from './component-stat'

export default {
  components: { ComponentStat },
  data () {
    return {
      cols: [
        {
          label: 'UID',
          prop: 'user_id'
        },
        {
          label: '昵称',
          prop: 'user_name'
        },
        {
          label: '真实姓名',
          prop: 'real_name'
        },
        {
          label: '账户类型',
          prop: 'account_type'
        },
        {
          label: '账号',
          prop: 'alipay_account'
        },
        {
          label: '提现金额',
          prop: 'money'
        }
      ]
    }
  },
  methods: {
    getWithdrawStats
  }
}
</script>
