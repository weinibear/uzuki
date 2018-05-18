<template>
  <main-content :cols="cols" :get-data="getData">
    <el-form
      slot="header"
      label-width="60px"
      label-suffix="：">
      <el-form-item label="筛选">
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
import { getBookList, backBook, deleteBook, changeRankStatus } from '@/api/book'
import { statusOptions, rankOptions, channelOptions, needPayOptions,
  endOptions, blackRankOptions, groupOptions, orderOptions, sortOptions } from './options'
import { mapMutations } from 'vuex'
import DialogBook from './dialog-book.js'
import { confirm } from '@/utils/confirm'
import { parseCount } from '@/utils/index'

export default {
  components: { DialogBook },
  data () {
    const getAllOptions = function (options, text) {
      return [{ label: '全部' + text, value: undefined }].concat(options)
    }
    const filters = [
      { prop: 'status', options: getAllOptions(statusOptions, '状态') },
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
    const vm = this
    filters.concat(sorts).forEach(obj => {
      Object.defineProperty(obj, 'value', {
        configurable: true,
        enumerable: true,
        get () {
          const value = vm.$route.query[this.prop]
          return this.options.some(v => String(v.value) === String(value))
            ? value
            : this.options[0].value
        },
        set (val) {
          vm.$router.push({
            query: { ...vm.$route.query, [this.prop]: val, page: 1 }
          })
        }
      })
    })
    return {
      filters,
      sorts,
      fields: [
        { label: '标题', value: 'default' },
        { label: 'ID', value: 'id' },
        { label: '作者', value: 'author_name' },
        { label: '出品', value: 'press' }
      ],
      inputValue: '',
      inputType: 'default',
      current: null,
      cols: [
        {
          label: '书籍ID',
          prop: 'id',
          width: 80,
          render: (h, row) => <el-button type="text" onClick={this.link.bind(this, row)}>
            {row.id}
          </el-button>
        },
        {
          label: '封面',
          width: 120,
          component: 'col-cover'
        },
        {
          label: '标题/作者',
          render: (h, row) => (
            <dl>
              <dt>标题</dt>
              <dd><col-title row={row} type="book"></col-title></dd>
              <dt>作者</dt>
              <dd>{row.author_name}</dd>
            </dl>
          )
        },
        {
          label: '简介',
          render: (h, row) => <div class="intro">{row.intro}</div>
        },
        {
          label: '数据',
          width: 120,
          render: (h, row) => (
            <dl>
              <dt>字数</dt>
              <dd title={row.count}>{parseCount(row.count)}</dd>
              <dt>点击</dt>
              <dd title={row.views}>{parseCount(row.views)}</dd>
              <dt>收藏</dt>
              <dd title={row.follow_count}>{parseCount(row.follow_count)}</dd>
              <dt>轻石</dt>
              <dd title={row.coin}>{parseCount(row.coin)}</dd>
              <dt>重石</dt>
              <dd title={row.gold}>{parseCount(row.gold)}</dd>
            </dl>
          )
        },
        {
          label: '分类',
          width: 80,
          render: (h, row) => row.categories.map(item => <el-tag>{item.name}</el-tag>)
        },
        {
          label: '排行',
          width: 80,
          render: (h, row) => (
            <dl>
              <dt>本日</dt>
              <dd>{row.day_rank}</dd>
              <dt>本周</dt>
              <dd>{row.week_rank}</dd>
              <a onClick={this.handleRank.bind(this, row)}>{row.black_rank ? '回榜' : '下榜'}</a>
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
          label: '创建/更新时间',
          width: 150,
          component: 'col-time'
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
          render: (h, row) => (
            <div>
              <el-button plain onClick={this.link.bind(this, row)}>卷目</el-button>
              <el-button plain type="primary" onClick={this.modify.bind(this, row)}>修改</el-button>
              <el-button plain type="warning" disabled={row.status !== 6} onClick={this.withdraw.bind(this, row)}>下架</el-button>
              <el-button plain type="danger" onClick={this.del.bind(this, row)}>删除</el-button>
            </div>
          )
        }
      ]
    }
  },
  computed: {
    query () {
      const result = {
        order: this.sorts[1].value + this.sorts[0].value
      }
      this.filters.forEach(obj => {
        result[obj.prop] = obj.value
      })
      return result
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
        params.raw_q = this.inputType + ':' + JSON.stringify(this.inputValue)
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
