<template>
  <main-content
    :cols="cols"
    :get-data="getData"
    row-key="id"
    sortable
    :save-order="saveOrder">
    <el-button slot="header" type="primary" icon="el-icon-plus">添加卷</el-button>
  </main-content>
</template>

<script>
import { getVolumeList } from '@/api/book'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      cols: [
        {
          label: '卷ID',
          prop: 'id'
        },
        {
          label: '序号',
          prop: 'order'
        },
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '字数',
          prop: 'count'
        },
        {
          label: '创建/更新时间',
          component: 'col-time'
        },
        {
          label: '操作',
          render: (h, row) => (
            <div>
              <el-button plain onClick={this.link.bind(this, row)}>章节</el-button>
              <el-button>修改</el-button>
              <el-button>删除</el-button>
            </div>
          )
        }
      ]
    }
  },
  computed: {
    bid () {
      return this.$route.params.bid
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    getData ({ offset, limit }) {
      return getVolumeList(this.bid, { offset, limit })
    },
    saveOrder () {},
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      const bid = this.$route.params.bid
      this.$router.push(`/book/${bid}/volume/${data.id}/chapters`)
    }
  }
}
</script>
