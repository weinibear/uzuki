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
          <el-option label="管理员" value="admin"></el-option>
          <el-option label="超级管理员" value="super_admin"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="add">添加管理员</el-button>
      </el-form-item>
    </el-form>
    <dialog-user-admin ref="dialog"></dialog-user-admin>
  </main-content>
</template>

<script>
import { getUserList, delAdmin } from '@/api/user'
import DialogUserAdmin from './dialog-user-admin'
import { confirm } from '@/utils/confirm'

export default {
  components: { DialogUserAdmin },
  data () {
    return {
      currentId: '',
      pageSize: 50,
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
          label: '操作',
          width: 300,
          render: (h, row) => {
            return (
              <div>
                <el-button type="danger"
                  icon="el-icon-delete"
                  disabled={this.status !== 'admin'}
                  onClick={this.del.bind(this, row)}>移除</el-button>
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
        return this.$route.query.status || 'admin'
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
    getData () {
      const params = {
        target: 'admin',
        status: this.status
      }
      return getUserList(params).then(res => {
        this.pageSize = res.count
        return {
          results: res.result,
          count: res.count
        }
      })
    },
    del (data) {
      if (this.status !== 'admin') {
        return
      }
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delAdmin(data.uid).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    add () {
      this.$refs.dialog.visible = true
    }
  }
}
</script>
