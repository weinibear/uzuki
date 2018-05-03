<template>
  <main-content
    :cols="cols"
    :page-size="50"
    :get-data="getData">
  </main-content>
</template>

<script>
import { getWithdrawRecord } from '@/api/wallet'
import { formatDate } from '@/utils/index'

export default {
  data () {
    return {
      cols: [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '金额',
          prop: 'money'
        },
        {
          label: '姓名',
          prop: 'real_name'
        },
        {
          label: '支付宝账号',
          prop: 'ailpay_account'
        },
        {
          label: '状态',
          render: (h, row) => {
            return <span>{row.state ? '提现成功' : '提现失败'}</span>
          }
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
    getData ({ offset, limit }) {
      const uid = this.$route.params.uid
      return getWithdrawRecord(uid, offset, limit)
    }
  }
}
</script>
