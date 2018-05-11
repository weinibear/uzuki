<template>
  <component-stat :cols="cols" :get-list="getList"></component-stat>
</template>

<script>
import { getRechargeStats } from '@/api/stats'
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
            const link = `/stats/recharge/${date[0]}/${date[1]}/${date[2]}`
            return (
              <router-link to={link}>{row.date}</router-link>
            )
          }
        },
        {
          label: '微信+QQ钱包(PingPP)(元)',
          prop: 'pingpp_income'
        },
        {
          label: '支付宝(元)',
          prop: 'alipay_income'
        },
        {
          label: '苹果内购(元)',
          prop: 'applepay_income'
        },
        {
          label: 'PayPal(美元)',
          prop: 'paypal'
        },
        {
          label: '总收入',
          prop: 'all_income'
        }
      ]
    }
  },
  methods: {
    getList (params) {
      return getRechargeStats(params).then(res => {
        res.result.forEach(val => {
          val.paypal = '收入：' + val.paypal[0] + ' / 手续费：' + val.paypal[1]
          val.all_income = val.all_income[0] + '元 / ' + val.all_income[1] + '美元'
        })
        return res
      })
    }
  }
}
</script>
