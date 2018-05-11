<template>
  <component-stat :cols="cols" :get-list="getUpdateStats"></component-stat>
</template>

<script>
import { getUpdateStats } from '@/api/stats'
import ComponentStat from './component-stat'

export default {
  components: { ComponentStat },
  data () {
    return {
      cols: [
        {
          label: '时间',
          prop: 'date'
        },
        {
          label: '新增小说',
          prop: 'new_book_count'
        },
        {
          label: '新增演绘',
          prop: 'new_game_count'
        },
        {
          label: '小说更新',
          prop: 'update_book_count'
        }
      ]
    }
  },
  methods: {
    getUpdateStats
  }
}
</script>
