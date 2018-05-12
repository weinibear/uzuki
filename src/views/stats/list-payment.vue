<template>
  <component-stat :cols="cols" :get-list="getPaymentStats"></component-stat>
</template>

<script>
import { getPaymentStats } from '@/api/stats'
import ComponentStat from './component-stat'
import { mapMutations } from 'vuex'

export default {
  components: { ComponentStat },
  data () {
    return {
      cols: [
        {
          label: '作品ID',
          prop: 'id',
          render: (h, row) => {
            return <el-button type="text" onClick={this.link.bind(this, row)}>{row.id}</el-button>
          }
        },
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '作者ID',
          prop: 'author_id'
        },
        {
          label: '昵称',
          prop: 'author_name'
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
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push(`${this.$route.path}/${data.id}`)
    },
    getPaymentStats
  }
}
</script>
