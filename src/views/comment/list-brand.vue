<template>
  <main-content :cols="cols" :get-data="getData" :page-size="10">
    <el-form
      slot="header"
      inline
      label-width="60px"
      label-suffix="：">
      <el-form-item label="搜索">
        <el-input
          @keyup.native.enter="search"
          v-model="inputValue"
          style="width:500px;">
          <el-select v-model="inputType" slot="prepend" style="width:100px">
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
    <dialog-brand :data="current" ref="dialog" @success="getList"></dialog-brand>
  </main-content>
</template>

<script>
import { getBrandList, getBrandDetail } from '@/api/comment'
import { mapMutations } from 'vuex'
import DialogBrand from './dialog-brand'

export default {
  components: { DialogBrand },
  data () {
    const fields = [
      { label: '名称', value: 'name' },
      { label: '作品ID', value: 'workId' },
      { label: '板块ID', value: 'brandId' }
    ]
    return {
      fields,
      current: null,
      inputValue: '',
      inputType: fields[0].value,
      cols: [
        {
          label: 'ID',
          prop: 'id'
        },
        {
          label: '板块名',
          prop: 'name',
          render: (h, row) => <el-button type="text" onClick={this.link.bind(this, row)}>{row.name}</el-button>
        },
        {
          label: '创建日期',
          component: 'col-time'
        },
        {
          label: '状态',
          render: (h, row) => {
            return <el-tag type={row.locked ? 'success' : 'danger'}>{row.locked ? '已锁定' : '未锁定'}</el-tag>
          }
        },
        {
          label: '操作',
          render: (h, row) => {
            return (
              <div>
                <el-button onClick={this.modify.bind(this, row)}>修改</el-button>
              </div>
            )
          }
        }
      ]
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
        limit
      }
      this.inputValue = this.$route.query.q || ''
      this.inputType = this.$route.query.field || this.fields[0].value
      if (this.inputValue) {
        if (this.inputType === 'brandId') {
          return getBrandDetail(this.inputValue).then(res => {
            return {
              count: 1,
              results: [res]
            }
          })
        }
        params[this.inputType] = this.inputValue
      }
      return getBrandList(params)
    },
    search () {
      this.$router.push({
        query: {
          ...this.$route.query,
          q: this.inputValue,
          field: this.inputType,
          page: 1
        }
      })
    },
    modify (row) {
      this.current = row
      this.$refs.dialog.visible = true
    },
    link (row) {
      this.pushBreadcrumb({ to: '', name: row.name })
      this.$router.push({
        name: '帖子管理',
        params: {
          bid: row.id
        }
      })
    }
  }
}
</script>
