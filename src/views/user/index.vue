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
    <dialog-user-profile ref="dialogUserDetail" :uid="currentId" @success="getList"></dialog-user-profile>
    <dialog-user-real ref="dialogUserReal" :uid="currentId"></dialog-user-real>
  </main-content>
</template>

<script>
import { getUserList, updateUserPassword } from '@/api/user'
import DialogUserProfile from './dialog-user-profile'
import DialogUserReal from './dialog-user-real'

export default {
  components: { DialogUserProfile, DialogUserReal },
  data () {
    return {
      currentId: '',
      inputValue: '',
      inputType: 'uid',
      fields: [
        { label: 'UID', value: 'uid' },
        { label: '昵称', value: 'username' },
        { label: '手机', value: 'mobile' }
      ],
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
          label: '过审书籍 / 全部书籍',
          render: (h, row) => <span>{row.book_pass_count} / {row.book_count}</span>
        },
        {
          label: '过审演绘 / 全部演绘',
          render: (h, row) => <span>{row.game_pass_count} / {row.game_count}</span>
        },
        {
          label: '操作',
          width: 300,
          render: (h, row) => {
            return (
              <div>
                <el-button plain onClick={this.editDetail.bind(this, row)}>编辑详情</el-button>
                <el-button plain onClick={this.editReal.bind(this, row)}>实名信息</el-button>
                <el-button plain onClick={this.updatePassword.bind(this, row)}>重置密码</el-button>
              </div>
            )
          }
        }
      ]
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
        target: 'user'
      }
      this.inputValue = this.$route.query.q || ''
      this.inputType = this.$route.query.field || this.fields[0].value
      if (this.inputValue) {
        params.value = this.inputValue
        params.keyword = this.inputType
      }
      return getUserList(params).then(res => {
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
    editDetail (data) {
      this.currentId = data.uid
      this.$refs.dialogUserDetail.visible = true
    },
    editReal (data) {
      this.currentId = data.uid
      this.$refs.dialogUserReal.visible = true
    },
    updatePassword (data) {
      this.$prompt('请输入新密码', '重置密码', {
        inputValidator: (val) => {
          if (val.length < 6 || val.length > 25) {
            return '长度在 6 到 25 个字符'
          }
          return true
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const password = instance.inputValue
            instance.confirmButtonLoading = true
            updateUserPassword(data.uid, password).then(() => {
              done()
            }).finally(() => {
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      })
    }
  }
}
</script>
