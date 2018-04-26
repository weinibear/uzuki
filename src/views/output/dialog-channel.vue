<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    :title="title">
    <el-form
      :model="form"
      ref="form"
      label-width="80px">
      <el-form-item
        label="渠道名"
        prop="name"
        :rules="{ required: true, message: '名字不能为空' }">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item
        label="插图"
        prop="illustration">
        <el-switch
          v-model="form.illustration"
          active-text="有"
          inactive-text="无">
        </el-switch>
      </el-form-item>
      <el-form-item
        label="密钥"
        prop="secret_key">
        <el-input v-model="form.secret_key"></el-input>
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
import { updateChannel, createChannel } from '@/api/output'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      visible: false,
      btnLoading: false,
      form: {
        name: '',
        illustration: true,
        secret_key: ''
      }
    }
  },
  computed: {
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改渠道' : '添加渠道'
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.data) {
          this.$nextTick().then(() => {
            Object.keys(this.form).forEach(key => {
              this.form[key] = this.data[key]
            })
          })
        }
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
      const form = { ...this.form }
      if (this.id && this.data.secret_key === form.secret_key) {
        delete form.secret_key
      }
      Promise.resolve(
        this.id
          ? updateChannel(this.id, form)
          : createChannel(form)
      ).finally(() => {
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
