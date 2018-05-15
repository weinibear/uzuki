<template>
  <main-content :cols="cols" :get-data="getData" :page-size="50">
    <el-form
      slot="header"
      inline
      label-width="60px"
      label-suffix="：">
      <el-form-item label="搜索">
        <el-input
          @keyup.native.enter="search"
          v-model="inputValue"
          style="width:300px;">
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
import { getDanmuList } from '@/api/danmu'
import { mapMutations } from 'vuex'

export default {
  data () {
    const fields = [
      { label: '小说', value: 'book' },
      { label: '演绘', value: 'game' }
    ]
    return {
      fields,
      inputValue: '',
      inputType: fields[0].value,
      cols: [
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '章节ID',
          render: (h, row) => <span>{row.chapter_id || row.scene_id}</span>
        },
        {
          label: '章节标题',
          render: (h, row) => <span>{row.chapter_title || row.scene_title}</span>
        },
        {
          label: '弹幕数',
          prop: 'count',
          render: (h, row) => {
            return (
              row.count
                ? <el-button type="text" onClick={this.link.bind(this, row)}>{row.count}</el-button>
                : <span>{row.count}</span>
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
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({offset, limit}) {
      const page = Math.floor(offset / limit) + 1
      const params = {
        page,
        number: 1
      }
      this.inputValue = this.$route.query.q || ''
      this.inputType = this.$route.query.field || this.fields[0].value
      if (this.inputValue) {
        params.id = this.inputValue
        params.type = this.inputType
      } else {
        return Promise.resolve({
          result: [],
          count: 0
        })
      }
      return getDanmuList(params).then(res => {
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
          field: this.inputType,
          page: 1
        }
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
