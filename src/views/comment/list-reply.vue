<template>
  <main-content :cols="cols" :get-data="getData" :page-size="20">
    <el-form
      slot="header"
      inline
      label-width="60px"
      label-suffix="：">
      <el-form-item>
        <el-input
          style="width: 210px"
          placeholder="回帖ID"
          clearable
          @keyup.native.enter="search"
          v-model="input.thread_id">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="内容"
          clearable
          @keyup.native.enter="search"
          v-model="input.content">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="用户ID"
          clearable
          @keyup.native.enter="search"
          v-model="input.user_id">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
  </main-content>
</template>

<script>
import { getReplyList, delReply, getReplyDetail, searchReply } from '@/api/comment'
import { mapMutations } from 'vuex'
import { confirm } from '@/utils/confirm'

export default {
  data () {
    return {
      input: {
        user_id: '',
        content: '',
        thread_id: ''
      },
      cols: [
        {
          label: '帖子',
          prop: 'post',
          render: (h, row) => {
            const to = {
              name: '帖子管理',
              query: {
                post_id: row.post
              }
            }
            return <router-link to={to}>{row.post}</router-link>
          }
        },
        {
          label: '用户',
          render: (h, row) => {
            return <span>{`${row.user.username}(${row.user.id})`}</span>
          }
        },
        {
          label: '内容',
          prop: 'content',
          'min-width': 200
        },
        {
          label: '创建/更新日期',
          component: 'col-time'
        },
        {
          label: '删除',
          width: 100,
          render: (h, row) => <el-button type="danger" onClick={this.del.bind(this, row)}>删除</el-button>
        }
      ]
    }
  },
  computed: {
    pid () {
      return this.$route.params.pid
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({offset, limit}) {
      let params = {
        offset,
        limit
      }
      this.input.thread_id = this.$route.query.thread_id
      this.input.content = this.$route.query.content
      this.input.user_id = this.$route.query.user_id
      if (this.pid) {
        return getReplyList(this.pid, params)
      } else if (this.input.thread_id) {
        return getReplyDetail(this.input.thread_id).then(res => {
          return {
            count: 1,
            results: [res]
          }
        })
      }
      params = { ...params, ...this.input }
      return searchReply(params)
    },
    search () {
      this.$router.push({
        params: {
          pid: undefined
        },
        query: {
          ...this.input
        }
      })
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delReply(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    link (row) {
      this.pushBreadcrumb({ to: '', name: row.chapter_title || row.scene_title })
      this.$router.push({
        name: '章节弹幕',
        params: {
          type: this.inputType,
          bid: this.inputValue,
          cid: row.chapter_id || row.scene_id
        }
      })
    }
  }
}
</script>
