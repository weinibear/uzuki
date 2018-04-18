<template>
  <main-content :cols="cols" :get-data="getData">
    <el-form
      slot="header"
      inline
      label-suffix="：">
      <el-form-item label="筛选">
        <el-select v-for="select in filters"
          :key="select.prop"
          v-model="select.value">
          <el-option v-for="option in select.options"
            :key="option.value"
            :label="option.name"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索">
        <el-input
          @keyup.native.enter="search"
          v-model="inputValue"
          style="width:280px">
          <el-select v-model="inputType" slot="prepend" style="width:80px">
            <el-option label="标题" value="default"></el-option>
            <el-option label="作者" value="author_name"></el-option>
            <el-option label="出品" value="press"></el-option>
            <el-option label="ID" value="id"></el-option>
          </el-select>
          <el-button slot="append"
            @click="search"
            icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <dialog-game ref="dialog"
      @success="getList"
      :data="current"></dialog-game>
  </main-content>
</template>

<script>
import { getGameList, editNeedPay, editDiscount, withdrawGame } from '@/api/yanhui/game'
import { mapMutations } from 'vuex'
import { gameStatusOptions } from './options'
import DialogGame from './dialog-game'

export default {
  name: 'yanhui',
  components: { DialogGame },
  data () {
    const filterStatusOptions = [{
      name: '全部状态',
      value: undefined
    }].concat(gameStatusOptions)
    const filters = [
      { prop: 'status', options: filterStatusOptions }
    ]
    const vm = this
    filters.forEach(obj => {
      Object.defineProperty(obj, 'value', {
        configurable: true,
        enumerable: true,
        get () {
          const value = parseInt(vm.$route.query[this.prop], 10)
          return !isNaN(value) && this.options.some(v => v.value === value)
            ? value
            : this.options[0].value
        },
        set (val) {
          vm.$router.push({
            query: { ...vm.$route.query, [this.prop]: val }
          })
        }
      })
    })
    return {
      filters,
      current: null,
      inputType: '',
      inputValue: '',
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
                <dd><el-button
                  type="text"
                  size="mini"
                  onClick={this.modifyNeedPay.bind(this, row)}>修改</el-button></dd>
                <dt>折扣</dt>
                <dd style={{ display: 'inline-block', width: '3em' }}>{row.discount}%</dd>
                <dd><el-button
                  type="text"
                  size="mini"
                  onClick={this.modifyDiscount.bind(this, row)}>修改</el-button></dd>
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
                <el-button plain onClick={this.modify.bind(this, row)}>修改</el-button>
                <el-button type="danger" plain onClick={this.withdraw.bind(this, row)}>下架</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    query () {
      const result = {}
      this.filters.forEach(obj => {
        result[obj.prop] = obj.value
      })
      return result
    }
  },
  watch: {
    $route: {
      handler (val) {
        this.inputValue = val.query.q || ''
        this.inputType = val.query.field || 'default'
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    search () {
      this.$router.push({
        query: {
          ...this.$route.query,
          q: this.inputValue,
          field: this.inputType
        }
      })
    },
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const query = this.query
      const params = {
        offset,
        limit,
        ...query
      }
      if (this.inputValue) {
        params.raw_q = this.inputType + ':' + JSON.stringify(this.inputValue)
      }
      return getGameList(params)
    },
    add () {
      this.current = null
      this.$refs.dialog.visible = true
    },
    modify (data) {
      const current = { ...data }
      current.categories = current.categories.map(v => v.id)
      this.current = current
      this.$refs.dialog.visible = true
    },
    modifyNeedPay (data) {
      const pay = data.need_pay ? 0 : 1
      const title = `确定将${data.title}修改为「${pay ? '收费' : '免费'}」吗？`
      this.$confirm(title, '提示', {
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return editNeedPay(data.id, pay).finally(() => {
              instance.confirmButtonLoading = false
            }).then((res) => {
              this.$message.success('success')
              this.getList()
              done()
            })
          } else {
            done()
          }
        }
      })
    },
    modifyDiscount (data) {
      this.$prompt('请输入折扣百分比', '修改折扣', {
        inputValidator (val) {
          if (!/^\d+$/.test(val)) {
            return '请输入数字'
          }
          const num = parseInt(val, 10)
          if (num < 0 || num > 100) {
            return '折扣应在 0 ~ 100 之间'
          }
          return true
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            const value = parseInt(instance.inputValue, 10)
            return editDiscount(data.id, value).finally(() => {
              instance.confirmButtonLoading = false
            }).then((res) => {
              this.$message.success('success')
              this.getList()
              done()
            })
          } else {
            done()
          }
        }
      })
    },
    withdraw (data) {
      this.$prompt('输入下架理由', '提示', {
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return withdrawGame(data.id, instance.inputValue).finally(() => {
              instance.confirmButtonLoading = false
            }).then(() => {
              done()
              this.$message.success('success')
              this.getList()
            })
          } else {
            done()
          }
        }
      })
    },
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push({ name: '演绘章节', params: { gid: data.id } })
    }
  }
}
</script>
