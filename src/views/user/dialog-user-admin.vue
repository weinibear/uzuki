<template>
  <el-dialog :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false"
    title="修改用户状态">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="80px">
      <el-form-item label="UID" prop="uid">
        <el-input v-model="form.uid"></el-input>
      </el-form-item>
      <el-form-item label="操作" prop="action">
        <el-select v-model="form.status">
          <el-option v-for="item in status"
            :key="item.value"
            :value="item.value"
            :label="item.label"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createAdmin, delAdmin } from '@/api/user'

export default {
  data () {
    return {
      visible: false,
      btnLoading: false,
      status: [
        { value: 'add', label: '添加' },
        { value: 'remove', label: '移除' }
      ],
      form: {
        status: 'add',
        uid: ''
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
      const uid = this.form.uid
      Promise.resolve(
        this.form.status === 'add'
          ? createAdmin(uid)
          : delAdmin(uid)
      ).finally(() => {
        this.btnLoading = false
      }).then(() => {
        this.$message.success('操作成功')
        this.visible = false
        this.$emit('success')
      })
    }
  }
}
</script>
