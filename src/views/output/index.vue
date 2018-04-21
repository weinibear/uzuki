<template>
  <main-content :cols="cols" :get-data="getData">
    <el-form
      slot="header"
      label-width="60px"
      label-suffix="：">
      <el-form-item label="渠道">
        <el-radio-group
          v-model="currentChannel">
          <el-radio-button
            v-for="item in channelList"
            :key="item.id"
            :label="item.id">
            {{item.name}}
          </el-radio-button>
        </el-radio-group>
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
        <el-button type="primary">导入作品</el-button>
        <el-button type="primary">导入TXT</el-button>
        <el-button type="success">渠道列表</el-button>
      </el-form-item>
    </el-form>
    <dialog-book ref="dialog" @success="getList" :data="current"></dialog-book>
  </main-content>
</template>

<script>
import { getChannelBooklist } from '@/api/output'
import { mapMutations, mapState } from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'
import DialogBook from './dialog-book'
import store from '@/store'

export default {
  name: 'outputs',
  components: { DialogBook },
  data () {
    return {
      current: null,
      fields: [
        { label: '标题', value: 'title' },
        { label: '作者', value: 'author_name' },
        { label: '简介', value: 'intro' }
      ],
      inputType: '',
      inputValue: '',
      cols: [
        {
          label: 'id',
          prop: 'id',
          width: 80,
          render: (h, row) => <el-button type="text" onClick={this.link.bind(this, row)}>{row.id}</el-button>
        },
        {
          label: 'BookID',
          prop: 'works_id',
          width: 80
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
                <dd>{row.title}</dd>
                <dt>作者</dt>
                <dd>{row.author_name}</dd>
              </dl>
            )
          }
        },
        {
          label: '简介',
          prop: 'intro'
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
                <el-button type="danger" plain onClick={this.del.bind(this, row)}>删除</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('output', ['channelList']),
    currentChannel: {
      get () {
        const channel = parseInt(this.$route.query.channel, 10)
        return channel || (this.channelList[0] && this.channelList[0].id)
      },
      set (val) {
        this.$router.push({ query: { ...this.$route.query, channel: val, page: 1 } })
      }
    }
  },
  watch: {
    $route: {
      handler (val) {
        this.inputValue = val.query.q || ''
        this.inputType = val.query.field || this.fields[0].value
      },
      immediate: true
    }
  },
  beforeRouteEnter (to, from, next) {
    store.dispatch('output/getChannelCache').then(() => {
      next()
    })
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
      const channelId = this.currentChannel
      const params = {
        offset,
        limit
      }
      if (this.inputValue) {
        params[this.inputType] = this.inputValue
      }
      return getChannelBooklist(channelId, params)
    },
    modify (data) {
      this.current = _cloneDeep(data)
      this.$refs.dialog.visible = true
    },
    del () {

    },
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      this.$router.push({ name: '演绘章节', params: { gid: data.id } })
    }
  }
}
</script>
