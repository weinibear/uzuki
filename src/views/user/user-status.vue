<template>
  <main-content
    :cols="cols"
    :page-size="pageSize"
    :get-data="getData">
    <el-form
      slot="header"
      inline
      label-suffix="：">
      <el-form-item label="筛选">
        <el-select v-model="status">
          <el-option label="封号" value="ban"></el-option>
          <el-option label="禁言" value="gag"></el-option>
          <el-option label="全部" value=""></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" icon="el-icon-info" @click="editAll">大哥你说要砍谁</el-button>
      </el-form-item>
    </el-form>
    <dialog-user-status ref="dialog" :uid="currentId" @success="getList"></dialog-user-status>
  </main-content>
</template>

<script>
import { getUserList } from '@/api/user'
import DialogUserStatus from './dialog-user-status'

export default {
  components: { DialogUserStatus },
  data () {
    return {
      currentId: '',
      pageSize: 50,
      cols: [
        {
          label: 'UID',
          prop: 'uid',
          width: 100
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
          label: '状态',
          render: (h, row) => <span>{row.status || 'ok'}</span>
        },
        {
          label: '说明',
          render: (h, row) => <span>{row.description || '空'}</span>
        },
        {
          label: '操作',
          width: 300,
          render: (h, row) => {
            return (
              <div>
                <el-button type="danger"
                  icon="el-icon-info"
                  onClick={this.edit.bind(this, row)}>砍他</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  computed: {
    status: {
      get () {
        return this.$route.query.status || ''
      },
      set (val) {
        this.$router.push({
          query: {
            ...this.$route.query,
            status: val
          }
        })
      }
    }
  },
  methods: {
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      const page = Math.floor(offset / limit) + 1
      const params = {
        page,
        target: 'user_status'
      }
      if (this.status) {
        params.keyword = this.status
      }
      return getUserList(params).then(res => {
        this.pageSize = res.count
        return {
          results: res.result,
          count: res.all_count
        }
      })
    },
    edit (data) {
      this.currentId = data.uid
      this.$refs.dialog.visible = true
    },
    editAll () {
      this.currentId = ''
      this.$refs.dialog.visible = true
    }
  }
}
</script>
