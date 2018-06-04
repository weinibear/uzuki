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
          label: 'QQ钱包(PingPP)(元)',
          prop: 'pingxx_qpay'
        },
        {
          label: '微信APP',
          prop: 'pingxx_wx'
        },
        {
          label: '微信扫码付',
          prop: 'pingxx_wx_pub_qr'
        },
        {
          label: '支付宝(元)',
          prop: 'alipay'
        },
        {
          label: '苹果内购(元)',
          prop: 'apple'
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
          let totalCNY = 0
          let totalUSD = 0
          const arr = ['paypal', 'alipay', 'pingxx_qpay', 'pingxx_wx', 'pingxx_wx_pub_qr', 'apple']
          arr.forEach(item => {
            if (item === 'paypal') {
              totalUSD += (val[item][0] - val[item][1])
            } else {
              totalCNY += (val[item][0] - val[item][1])
            }
            val[item] = '收入：' + val[item][0] + ' / 手续费：' + val[item][1]
          })
          val.all_income = totalCNY.toFixed(2) + '元 / ' + totalUSD.toFixed(2) + '美元'
        })
        return res
      })
    }
  }
}
</script>
