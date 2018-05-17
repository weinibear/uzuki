<template>
  <el-dialog :visible.sync="visible"
    width="500px"
    title="钱包管理">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="80px">
      <el-form-item label="UID" prop="uid">
        <el-input v-model="form.uid" placeholder="多个UID用逗号隔开"></el-input>
      </el-form-item>
      <el-form-item label="货币" prop="currency">
        <el-select v-model="form.currency">
          <el-option v-for="item in currencies"
            :key="item.value"
            :value="item.value"
            :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作" prop="action">
        <el-select v-model="form.action">
          <el-option v-for="item in actions"
            :key="item.value"
            :value="item.value"
            :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数值" prop="value">
        <el-input-number :min="1" v-model="form.value"></el-input-number>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { postWallet } from '@/api/wallet'

export default {
  props: ['uid'],
  data () {
    return {
      visible: false,
      btnLoading: false,
      currencies: [
        { value: 'coin', label: '轻石' },
        { value: 'gold', label: '重石' }
      ],
      actions: [
        { value: 'add', label: '增加' },
        { value: 'reduce', label: '减少' }
      ],
      form: {
        uid: '',
        currency: 'coin',
        action: 'add',
        value: 10
      },
      rules: {
        uid: [
          { required: true, message: 'UID不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.form.uid = this.uid
        this.form.currency = this.$route.name === '轻石管理' ? 'coin' : 'gold'
      } else {
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submit()
        }
      })
    },
    submit () {
      this.btnLoading = true
      const uid = String(this.form.uid).split(/[,，]/g).map(id => id.trim()).filter(id => id)
      Promise.all(uid.map(id => {
        const form = { ...this.form, uid: id }
        return postWallet(form)
      })).finally(() => {
        this.btnLoading = false
      }).then(() => {
        this.$message.success('success')
        this.visible = false
        this.$emit('success')
      })
    }
  }
}
</script>
