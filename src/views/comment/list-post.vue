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
          placeholder="帖子ID"
          clearable
          @keyup.native.enter="search"
          v-model="input.post_id">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          placeholder="标题"
          clearable
          @keyup.native.enter="search"
          v-model="input.title">
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
    <dialog-post-tag ref="dialog" :data="current" @success="getList"></dialog-post-tag>
  </main-content>
</template>

<script>
import {
  getPostList,
  getPostDetail,
  searchPost,
  topPost,
  cancelTopPost,
  lockPost,
  unlockPost,
  allTopPost,
  cancelAllTopPost,
  delPost
} from '@/api/comment'
import { mapMutations } from 'vuex'
import { confirm } from '@/utils/confirm'
import DialogPostTag from './dialog-post-tag'

export default {
  components: { DialogPostTag },
  data () {
    return {
      current: null,
      input: {
        post_id: '',
        title: '',
        content: '',
        user_id: ''
      },
      cols: [
        {
          label: '板块ID',
          prop: 'brand',
          render: (h, row) => {
            const to = {
              name: '板块管理',
              query: {
                q: row.brand,
                field: 'brandId'
              }
            }
            return <router-link to={to}>{row.brand}</router-link>
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
          'min-width': 200,
          render: (h, row) => {
            return row.count > 0
              ? <a type="text" onClick={this.linkReply.bind(this, row)}>{row.content}({row.count}条回复)</a>
              : <span>{row.content}({row.count}条回复)</span>
          }
        },
        {
          label: '创建/更新日期',
          align: 'center',
          component: 'col-time'
        },
        {
          label: '标签',
          width: 100,
          align: 'center',
          render: (h, row) => {
            const tags = row.tags.map(tag => {
              return tag.type
                ? <img src={tag.value} style="max-height:24px;vertical-align: middle;"/>
                : <el-tag>{tag.value}</el-tag>
            })
            const btn = <el-button
              onClick={this.handleTag.bind(this, row)}
              plain
              size="mini"
              icon="el-icon-edit">{tags.length ? '修改' : '添加'}</el-button>
            tags.push(btn)
            return tags
          }
        },
        {
          label: '状态',
          align: 'center',
          width: 120,
          render: (h, row) => {
            const top = row.top ? { type: 'success', label: '已置顶' } : { type: 'warning', label: '未置顶' }
            const locked = row.locked ? { type: 'success', label: '已锁定' } : { type: 'warning', label: '未锁定' }
            const allTop = row.all_top ? { type: 'success', label: '已全区置顶' } : { type: 'warning', label: '未全区置顶' }
            return [locked, top, allTop].map(v => <el-tag type={v.type}>{v.label}</el-tag>)
          }
        },
        {
          label: '全区置顶',
          align: 'center',
          width: 100,
          render: (h, row) => <el-button
            type={row.all_top ? 'danger' : 'primary'}
            onClick={this.handleAllTop.bind(this, row)}>{row.all_top ? '取消' : '全区置顶'}</el-button>
        },
        {
          label: '置顶',
          align: 'center',
          width: 80,
          render: (h, row) => <el-button
            type={row.top ? 'danger' : 'primary'}
            onClick={this.handleTop.bind(this, row)}>{row.top ? '取消' : '置顶'}</el-button>
        },
        {
          label: '锁定',
          align: 'center',
          width: 80,
          render: (h, row) => <el-button
            type={row.locked ? 'danger' : 'primary'}
            onClick={this.handleLock.bind(this, row)}>{row.locked ? '取消' : '锁定'}</el-button>
        },
        {
          label: '删除',
          align: 'center',
          width: 80,
          render: (h, row) => <el-button type="danger" onClick={this.del.bind(this, row)}>删除</el-button>
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
    getList () {
      this.$emit('refresh')
    },
    getData ({offset, limit}) {
      let params = {
        offset,
        limit
      }
      this.input.post_id = this.$route.query.post_id
      this.input.title = this.$route.query.title
      this.input.content = this.$route.query.content
      this.input.user_id = this.$route.query.user_id
      if (this.bid) {
        return getPostList(this.bid, params)
      } else if (this.input.post_id) {
        return getPostDetail(this.input.post_id).then(res => {
          return {
            count: 1,
            results: [res]
          }
        })
      }
      params = { ...params, ...this.input }
      return searchPost(params)
    },
    search () {
      this.$router.push({
        params: {
          bid: undefined
        },
        query: {
          ...this.input
        }
      })
    },
    handleTop (row) {
      const id = row.id
      Promise.resolve(
        row.top
          ? cancelTopPost(id)
          : topPost(id)
      ).then(() => {
        this.getList()
      })
    },
    handleLock (row) {
      const id = row.id
      Promise.resolve(
        row.locked
          ? unlockPost(id)
          : lockPost(id)
      ).then(() => {
        this.getList()
      })
    },
    handleAllTop (row) {
      const id = row.id
      Promise.resolve(
        row.all_top
          ? cancelAllTopPost(id)
          : allTopPost(id)
      ).then(() => {
        this.getList()
      })
    },
    handleTag (row) {
      this.current = row
      this.$refs.dialog.visible = true
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delPost(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    linkReply (row) {
      this.pushBreadcrumb({ to: '', name: row.content })
      this.$router.push({
        name: '回复管理',
        params: {
          pid: row.id
        }
      })
    }
  }
}
</script>
