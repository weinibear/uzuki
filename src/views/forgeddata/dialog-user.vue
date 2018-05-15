<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    title="伪造用户">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="80px">
      <el-form-item label="电话号码" prop="target">
        <el-input v-model="form.mobile" placeholder="可以为数字或其他字符"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="target">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="target">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="save"
        :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createdUser } from '@/api/forgeddata'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      visible: false,
      btnLoading: false,
      form: {
        mobile: '',
        username: '',
        password: ''
      },
      rules: {
        mobile: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible (val) {
      if (!val) {
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
      const form = { ...this.form }
      createdUser(form).finally(() => {
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
