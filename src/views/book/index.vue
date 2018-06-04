<template>
  <main-content :cols="cols" :get-data="getData">
    <el-form
      slot="header"
      label-width="60px"
      label-suffix="：">
      <el-form-item label="筛选">
        <el-select class="inline-select" v-model="currentSource" v-if="isSource">
          <el-option v-for="option in sourceList"
            :key="option.source_id"
            :label="option.name"
            :value="option.source_id"></el-option>
        </el-select>
        <el-select class="inline-select" v-model="select.value" v-for="select in filters" :key="select.prop">
          <el-option v-for="option in select.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-select class="inline-select" v-model="select.value" v-for="select in sorts" :key="select.prop">
          <el-option v-for="option in select.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索" style="margin-bottom: 0">
        <el-input
          clearable
          @keyup.native.enter="search"
          v-model="inputValue"
          style="width:280px;margin-right: 10px">
          <el-select v-model="inputType" slot="prepend" style="width:80px">
            <el-option
              v-for="option in fields"
              :key="option.value"
              :label="option.label"
              :value="option.value"></el-option>
          </el-select>
          <el-button slot="append"
            @click="search"
            icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <dialog-book ref="dialog" @success="getList" :data="current"></dialog-book>
  </main-content>
</template>

<script>
import { getBookList, backBook, deleteBook, changeRankStatus, unbackBook } from '@/api/book'
import { statusOptions, rankOptions, channelOptions, needPayOptions,
  endOptions, blackRankOptions, groupOptions, orderOptions, sortOptions, sourceStatusOptions } from './options'
import { mapMutations, mapState } from 'vuex'
import DialogBook from './dialog-book.js'
import { confirm } from '@/utils/confirm'
import bookCols from './book-cols'
import defQuery from '@/utils/defQuery'
import store from '@/store'

export default {
  components: { DialogBook },
  data () {
    const getAllOptions = function (options, text) {
      return [{ label: '全部' + text, value: undefined }].concat(options)
    }
    const status = this.$route.name === 'book-input' ? sourceStatusOptions : statusOptions
    const filters = [
      { prop: 'status', options: getAllOptions(status, '状态') },
      { prop: 'rank', options: getAllOptions(rankOptions, '等级') },
      { prop: 'channel', options: getAllOptions(channelOptions, '分区') },
      { prop: 'need_pay', options: getAllOptions(needPayOptions, '付费状态') },
      { prop: 'end', options: getAllOptions(endOptions, '连载状态') },
      { prop: 'black_rank', options: getAllOptions(blackRankOptions, '榜单状态') },
      { prop: 'group', options: getAllOptions(groupOptions, '分组') }
    ]
    const sorts = [
      { prop: 'order', options: orderOptions },
      { prop: 'sort', options: sortOptions }
    ]
    filters.forEach(obj => defQuery(this, obj, 'number'))
    sorts.forEach(obj => defQuery(this, obj))
    return {
      filters,
      sorts,
      fields: [
        { label: '标题', value: 'title' },
        { label: 'ID', value: 'id' },
        { label: '作者', value: 'author_name' },
        { label: '出品', value: 'press' }
      ],
      inputValue: '',
      inputType: 'default',
      current: null,
      cols: [
        ...bookCols(this),
        {
          label: '排行',
          width: 120,
          render: (h, row) => (
            <dl>
              <dt>本日</dt>
              <dd>{row.day_rank}</dd>
              <dt>本周</dt>
              <dd>{row.week_rank}</dd>
              <div>
                <a onClick={this.handleRank.bind(this, row)}>{row.black_rank ? '回榜' : '下榜'}</a>
              </div>
            </dl>
          )
        },
        {
          label: '状态',
          width: 100,
          align: 'center',
          render: (h, row) => {
            const arr = [
              { prop: 'status', options: statusOptions },
              { prop: 'rank', options: rankOptions },
              { prop: 'end', options: endOptions },
              { prop: 'need_pay', options: needPayOptions },
              { prop: 'channel', options: channelOptions }
            ]
            return arr.map(v => {
              const none = { tag: 'danger', label: '未知' }
              const item = v.options.find(obj => row[v.prop] === obj.value) || none
              return <el-tag type={item.tag}>{item.label}</el-tag>
            })
          }
        },
        {
          label: '查看',
          width: 50,
          render: (h, row) => {
            return (
              <div>
                <router-link to={`/brand/${row.bf}/post`}>帖子</router-link>
                <router-link to={`/brand?field=brandId&q=${row.bf}`}>板块</router-link>
                <router-link to={`/danmu?field=book&q=${row.id}`}>弹幕</router-link>
              </div>
            )
          }
        },
        {
          label: '操作',
          width: 280,
          render: (h, row) => {
            const unback = <el-button plain disabled={row.status === 6} onClick={this.unback.bind(this, row)}>上架</el-button>
            const del = <el-button plain type="danger" onClick={this.del.bind(this, row)}>删除</el-button>
            return (
              <div>
                <el-button plain onClick={this.link.bind(this, row)}>卷目</el-button>
                <el-button plain type="primary" onClick={this.modify.bind(this, row)}>修改</el-button>
                <el-button plain type="warning" disabled={row.status !== 6} onClick={this.withdraw.bind(this, row)}>下架</el-button>
                { this.isSource ? unback : del }
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('book', ['sourceList']),
    currentSource: {
      get () {
        return +this.$route.query.source || 1
      },
      set (val) {
        this.$router.push({ query: { ...this.$route.query, source: val, page: 1 } })
      }
    },
    isSource () {
      return this.$route.name === 'book-input'
    },
    query () {
      const result = {
        ordering: this.sorts[1].value + this.sorts[0].value,
        source: this.currentSource
      }
      this.filters.forEach(obj => {
        result[obj.prop] = obj.value
      })
      return result
    }
  },
  beforeRouteEnter (to, from, next) {
    if (to.name === 'book-input') {
      store.dispatch('book/getSourceCache').then(data => {
        if (!to.query.source) {
          next({name: to.name, query: {...to.query, source: data[0].source_id}})
        } else {
          next()
        }
      })
    } else {
      next()
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({offset, limit}) {
      const params = {
        offset,
        limit,
        ...this.query
      }
      this.inputValue = this.$route.query.q || ''
      this.inputType = this.$route.query.field || this.fields[0].value
      if (this.inputValue) {
        params[this.inputType] = this.inputValue
      }
      return getBookList(params)
    },
    search () {
      this.$router.push({
        query: {
          ...this.$route.query,
          q: this.inputValue,
          field: this.inputType
        }
      })
    },
    modify (data) {
      const current = { ...data }
      current.categories = current.categories.map(v => v.id)
      this.current = current
      this.$refs.dialog.visible = true
    },
    withdraw (data) {
      this.$prompt('请输入下架信息', '下架', {
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            backBook(data.id, instance.inputValue).finally(() => {
              instance.confirmButtonLoading = false
            }).then(() => {
              this.getList()
              done()
            })
          } else {
            done()
          }
        }
      })
    },
    unback (data) {
      confirm(this.handleUnback.bind(this, data), { message: `是否确定上架<${data.title}>` })
    },
    handleUnback (data) {
      return unbackBook(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    handleRank (data) {
      const blackRank = !data.black_rank
      return changeRankStatus(data.id, blackRank).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return deleteBook(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push(`/book/${data.id}/volumes`)
    }
  }
}
</script>
