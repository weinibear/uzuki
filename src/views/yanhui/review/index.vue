<template>
  <main-content :cols="cols" :get-data="getData">
  </main-content>
</template>

<script>
import { getGameList } from '@/api/yanhui/game'
import { mapMutations } from 'vuex'
import { gameStatusOptions } from '../game/options'

export default {
  name: 'yanhuiReview',
  data () {
    return {
      current: null,
      cols: [
        {
          label: 'ID',
          prop: 'id',
          width: 80,
          render: (h, row) => <el-button type="text" onClick={this.link.bind(this, row)}>{row.id}</el-button>
        },
        {
          label: '封面',
          width: '120px',
          component: 'col-cover'
        },
        {
          label: '标题/作者',
          render: (h, row) => {
            return (
              <dl>
                <dt>标题</dt>
                <dd><col-title row={row} type="play"></col-title></dd>
                <dt>作者</dt>
                <dd>{row.author && row.author[0] && row.author[0].username}</dd>
              </dl>
            )
          }
        },
        {
          label: '简介',
          prop: 'intro'
        },
        {
          label: '价格',
          width: '140px',
          render: (h, row) => {
            return (
              <dl>
                <dt>付费</dt>
                <dd style={{ display: 'inline-block', width: '3em' }}>{row.need_pay ? '付费' : '免费'}</dd>
                <dt>折扣</dt>
                <dd style={{ display: 'inline-block', width: '3em' }}>{row.discount}%</dd>
              </dl>
            )
          }
        },
        {
          label: '状态',
          width: '90px',
          render: (h, row) => {
            const option = gameStatusOptions.find(obj => obj.value === row.status) || { tag: '', name: '未知' }
            return <el-tag type={option.tag}>{option.name}</el-tag>
          }
        },
        {
          label: '创建/更新时间',
          component: 'col-time',
          width: 160
        },
        {
          label: '操作',
          width: 250,
          render: (h, row) => {
            return (
              <div>
                <el-button plain onClick={this.link.bind(this, row)}>章节</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const params = {
        offset,
        limit,
        need_approval: 1
      }
      return getGameList(params)
    },
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push({
        name: '演绘章节',
        params: {
          gid: data.id,
          type: 'review'
        }
      })
    }
  }
}
</script>
