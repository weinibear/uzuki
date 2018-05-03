<template>
  <main-content
    :cols="cols"
    :page-size="50"
    :get-data="getData">
  </main-content>
</template>

<script>
import { getGoldRecord, getCoinRecord, getBalanceRecord } from '@/api/wallet'
import { formatDate } from '@/utils/index'

export default {
  data () {
    return {
      cols: [
        {
          label: '数量',
          prop: 'amount'
        },
        {
          label: '详情',
          prop: 'reason'
        },
        {
          label: '日期',
          render: (h, row) => {
            const date = formatDate(row.updated_time)
            return h('span', date)
          }
        }
      ]
    }
  },
  methods: {
    getCoin (...args) {
      return getCoinRecord(...args)
    },
    getGold (...args) {
      return getGoldRecord(...args).then(res => {
        res.results.forEach(v => {
          v.amount = v.gold
        })
        return res
      })
    },
    getBalance (...args) {
      return getBalanceRecord(...args).then(res => {
        res.results.forEach(v => {
          v.amount = v.money
        })
        return res
      })
    },
    getData ({ offset, limit }) {
      const uid = this.$route.params.uid
      const name = this.$route.name
      if (name === '轻石记录') {
        return this.getCoin(uid, offset, limit)
      } else if (name === '重石记录') {
        return this.getGold(uid, offset, limit)
      }
      return this.getBalance(uid, offset, limit)
    }
  }
}
</script>
