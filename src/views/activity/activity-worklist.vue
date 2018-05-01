<template>
  <main-content
    :cols="cols"
    :page-size="20"
    :get-data="getData">
    <el-form
      slot="header"
      inline
      label-suffix="：">
      <el-form-item label="搜索">
        <el-input
          @keyup.native.enter="search"
          v-model="inputValue"
          placeholder="输入作品ID搜索"
          style="width:280px;margin-right: 10px">
          <el-button slot="append"
            @click="search"
            icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="筛选">
        <el-select v-model="status">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="已审核" :value="1"></el-option>
          <el-option label="未审核" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="add">{{ type === 1 ? '添加书籍' : '添加演绘' }}</el-button>
      </el-form-item>
    </el-form>
  </main-content>
</template>

<script>
import * as activity from '@/api/activity'
import * as subject from '@/api/subject'
import { confirm } from '@/utils/confirm'

const api = {
  subject,
  activity
}

export default {
  data () {
    return {
      inputValue: '',
      cols: [
        {
          label: 'ID',
          prop: 'id',
          width: 100
        },
        {
          label: '标题',
          render: (h, row) => {
            return <col-title row={row} type={this.type === 1 ? 'book' : 'game'}></col-title>
          }
        },
        {
          label: '操作',
          render: (h, row) => {
            return (
              <div>
                <el-button type="danger" plain onClick={this.del.bind(this, row)}>删除</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    id () {
      return parseInt(this.$route.params.id, 10)
    },
    type () {
      return parseInt(this.$route.params.type, 10)
    },
    api () {
      return api[this.$route.name === '活动作品' ? 'activity' : 'subject']
    },
    status: {
      get () {
        return parseInt(this.$route.query.status, 10) || 0
      },
      set (val) {
        this.$router.push({ query: { status: val } })
      }
    }
  },
  methods: {
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const params = {
        offset,
        limit,
        status: this.status
      }
      this.inputValue = this.$route.query.q || ''
      if (this.inputValue) {
        params.work_id = this.inputValue
      }
      return this.api.getWorkList(this.id, this.type, params)
    },
    search () {
      this.$router.push({
        query: {
          ...this.$route.query,
          q: this.inputValue
        }
      })
    },
    add () {
      this.$prompt('请输入作品ID, 用逗号隔开', {
        inputValidator: (val) => {
          if (!val || val.trim() === '') {
            return '不能为空...'
          }
          return true
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = 'loading...'
            const work = instance.inputValue.trim().split(/[,，]/).map(v => +v)
            this.api.createWork(this.id, this.type, work).then(() => {
              this.getList()
              done()
            }).finally(() => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
            })
          } else {
            done()
          }
        }
      })
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return this.api.delWork(this.id, this.type, [data.id]).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
