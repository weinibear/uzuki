<template>
  <el-dialog :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false"
    title="修改实名信息">
    <el-form
      v-loading="loading"
      :model="form"
      :rules="rules"
      ref="form"
      label-width="80px">
      <el-form-item
        label="账户类型"
        prop="account_type">
        <el-select v-model="form.account_type">
          <el-option
            v-for="item in accountTypes"
            :key="item.value"
            :value="item.value"
            :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.account_type === 3"
        label="开户行"
        prop="bank_name">
        <el-input v-model="form.bank_name"></el-input>
      </el-form-item>
      <el-form-item
        v-for="item in [
          { label: '收款账号', prop: 'ailpay_account' },
          { label: '收款人', prop: 'payee' },
          { label: '真实姓名', prop: 'real_name'},
          { label: '身份证号', prop: 'id_card' }
        ]"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label">
        <el-input v-model="form[item.prop]"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUserRealInfo, updateUserRealInfo } from '@/api/user'

export default {
  props: ['uid'],
  data () {
    return {
      visible: false,
      loading: false,
      btnLoading: false,
      accountTypes: [
        { name: '支付宝', value: 1 },
        { name: '微信', value: 2 },
        { name: '银行卡', value: 3 }
      ],
      form: {
        account_type: 1,
        ailpay_account: 'null',
        bank_name: '',
        id_card: '',
        payee: '',
        real_name: '',
        uid: ''
      },
      rules: {
        bank_name: [
          {
            validator: (rule, value, callback) => {
              if (this.form.account_type === 3 && value === '') {
                callback(new Error('请输入开户行'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.getData()
      } else {
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    getData () {
      this.loading = true
      getUserRealInfo(this.uid).then(res => {
        Object.keys(this.form).forEach(key => {
          this.form[key] = res[key]
        })
      }).catch(() => {
        this.visible = false
      }).finally(() => {
        this.loading = false
      })
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submit()
        }
      })
    },
    submit () {
      this.btnLoading = true
      const form = { ...this.form }
      updateUserRealInfo(form).finally(() => {
        this.btnLoading = false
      }).then(() => {
        this.$message.success('保存成功')
        this.visible = false
        this.$emit('success')
      })
    }
  }
}
</script>
