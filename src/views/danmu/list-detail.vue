<template>
  <main-content
    :selected.sync="selected"
    :cols="cols"
    :get-data="getData"
    :page-size="50">
    <el-form
      slot="header"
      inline>
      <el-form-item>
        <el-button type="danger" icon="el-icon-delete" @click="del">批量删除</el-button>
      </el-form-item>
    </el-form>
  </main-content>
</template>

<script>
import { getDanmuList, delDanmu } from '@/api/danmu'
import { confirm } from '@/utils/confirm'

export default {
  data () {
    return {
      selected: [],
      cols: [
        {
          type: 'selection',
          width: 50
        },
        {
          label: '内容',
          prop: 'content'
        },
        {
          label: '章节',
          render: (h, row) => <span>{row.chapter_title || row.scene_title}</span>
        },
        {
          label: '发送人',
          prop: 'sender',
          render: (h, row) => {
            return (
              <dl>
                <dt>昵称</dt>
                <dd>{row.sender.username}</dd>
                <dt>ID</dt>
                <dd>{row.sender.id}</dd>
              </dl>
            )
          }
        },
        {
          label: '创建时间',
          component: 'col-time'
        }
      ]
    }
  },
  computed: {
    type () {
      return this.$route.params.type
    },
    bid () {
      return this.$route.params.bid
    },
    cid () {
      return this.$route.params.cid
    }
  },
  methods: {
    getList () {
      this.$emit('refresh')
    },
    getData ({offset, limit}) {
      const page = Math.floor(offset / limit) + 1
      const params = {
        page,
        type: this.type,
        id: this.bid
      }
      if (this.type === 'book') {
        params.chapter = this.cid
      } else if (this.type === 'game') {
        params.scene = this.cid
      }
      return getDanmuList(params).then(res => {
        return {
          results: res.result,
          count: res.all_count
        }
      })
    },
    del () {
      const ids = this.selected.map(v => v.id)
      if (ids.length === 0) {
        return this.$message.warning('至少选择一个( ⊙ o ⊙ )！')
      }
      confirm(this.delData.bind(this, ids))
    },
    delData (ids) {
      const data = {
        type: this.type,
        id: ids.join()
      }
      return delDanmu(data).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
