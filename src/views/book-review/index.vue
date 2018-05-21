<template>
  <main-content :cols="cols" :get-data="getData">
    <el-form
      slot="header"
      inline
      label-width="60px"
      label-suffix="：">
      <el-form-item label="筛选">
        <el-select v-model="select.value" v-for="select in filters" :key="select.prop">
          <el-option v-for="option in select.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-select v-model="select.value" v-for="select in sorts" :key="select.prop">
          <el-option v-for="option in select.options"
            :key="option.value"
            :label="option.label"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索">
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
  </main-content>
</template>

<script>
import { getBookList, approvalBook } from '@/api/book-review'
import { orderOptions, sortOptions } from '../book/options'
import { mapMutations } from 'vuex'
import { confirm } from '@/utils/confirm'
import bookCols from '../book/book-cols'
import defQuery from '@/utils/defQuery'

export default {
  data () {
    const filters = [
      {
        prop: 'status',
        options: [
          { label: '全部状态', value: undefined },
          { label: '部分通过', value: 2 },
          { label: '审核中', value: 3 }
        ]
      }
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
        { label: '标题', value: 'default' },
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
          label: '操作',
          width: 400,
          render: (h, row) => (
            <div>
              <el-button plain onClick={this.link.bind(this, row)}>章节</el-button>
              <el-button plain type="danger" onClick={this.reject.bind(this, row)}>全部退回</el-button>
              <el-button plain type="success" onClick={this.accept.bind(this, row)}>全部通过</el-button>
              <el-button plain type="primary" onClick={this.help.bind(this, row)}>卡书自救</el-button>
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
      params.need_approval = 1
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
    accept (row) {
      confirm(this.approval.bind(this, 'accept', row.id, '通过'), { message: '确定通过么' })
    },
    help (row) {
      confirm(this.approval.bind(this, 'help', row.id, '自救'), { message: '确定自救么' })
    },
    reject (row) {
      this.$prompt('请输入退回信息', '退回', {
        inputValidator: (val) => {
          if (!val || val.trim() === '') {
            return '给个理由呗...'
          }
          return true
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            this.approval('reject', row.id, instance.inputValue).finally(() => {
              instance.confirmButtonLoading = false
            }).then(() => {
              done()
            })
          } else {
            done()
          }
        }
      })
    },
    // 批量审核
    approval (action, id, value) {
      return approvalBook(action, id, value).then(() => {
        let message = ''
        if (action === 'accept') {
          message = '审核通过'
        } else if (action === 'reject') {
          message = '退回成功'
        } else if (action === 'help') {
          message = '自救成功'
        }
        // 后台异步, 避免编辑误操作, 延迟2秒返回
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve()
            this.$message.success(message)
            this.getList()
          }, 2000)
        })
      })
    },
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push(`/book/review/${data.id}`)
    }
  }
}
</script>
