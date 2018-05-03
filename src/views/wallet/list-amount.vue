<template>
  <main-content
    :cols="cols"
    :page-size="50"
    :get-data="getData">
    <el-form
      slot="header"
      inline
      label-suffix="：">
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
    <dialog-manage :uid="uid" ref="dialog" @success="getList"></dialog-manage>
  </main-content>
</template>

<script>
import { getCoinList, getGoldList, getCashList } from '@/api/wallet'
import DialogManage from './dialog-manage'
import { mapMutations } from 'vuex'

export default {
  components: { DialogManage },
  data () {
    return {
      inputValue: '',
      inputType: 'uid',
      uid: '',
      fields: [
        { label: 'UID', value: 'id' },
        { label: '昵称', value: 'username' }
      ],
      cols: [
        {
          label: 'UID',
          prop: 'uid'
        },
        {
          label: '昵称',
          prop: 'username'
        },
        {
          label: '手机',
          prop: 'mobile'
        },
        {
          label: '数量',
          render: (h, row) => {
            const stone = <span>{row.amount}</span>
            const cash = <span>余额: {row.amount} / 总额: {row.sum_amount}</span>
            return this.isCashList ? cash : stone
          }
        },
        {
          label: '操作',
          render: (h, row) => {
            const stone = <div>
              <el-button
                plain
                icon="el-icon-edit"
                onClick={this.postWallet.bind(this, row)}>增减</el-button>
              <el-button
                plain
                icon="el-icon-tickets"
                onClick={this.linkRecord.bind(this, row)}>记录</el-button>
            </div>
            const cash = <div>
              <el-button
                plain
                icon="el-icon-tickets"
                onClick={this.linkBalance.bind(this, row)}>收支记录</el-button>
              <el-button
                plain
                icon="el-icon-tickets"
                onClick={this.linkWithdraw.bind(this, row)}>提现记录</el-button>
            </div>
            return this.isCashList ? cash : stone
          }
        }
      ]
    }
  },
  computed: {
    apiGetList () {
      switch (this.$route.name) {
        case '轻石管理':
          return getCoinList
        case '重石管理':
          return getGoldList
        default:
          return getCashList
      }
    },
    isCashList () {
      return this.$route.name === '收入管理'
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const page = Math.floor(offset / limit) + 1
      const params = {
        page
      }
      this.inputValue = this.$route.query.q || ''
      this.inputType = this.$route.query.field || this.fields[0].value
      if (this.inputValue) {
        params[this.inputType] = this.inputValue
      }
      return this.apiGetList(params).then(res => {
        return {
          results: res.result,
          count: res.all_count
        }
      })
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
    linkRecord (data) {
      this.pushBreadcrumb({ to: '', name: data.username })
      this.$router.push(this.$route.path + '/' + data.uid)
    },
    linkBalance (data) {
      this.pushBreadcrumb({ to: '', name: data.username + '的收支记录' })
      this.$router.push({
        name: '收支记录',
        params: {
          uid: data.uid
        }
      })
    },
    linkWithdraw (data) {
      this.pushBreadcrumb({ to: '', name: data.username + '的提现记录' })
      this.$router.push({
        name: '提现记录',
        params: {
          uid: data.uid
        }
      })
    },
    postWallet (data) {
      this.uid = data.uid
      this.$refs.dialog.visible = true
    }
  }
}
</script>
