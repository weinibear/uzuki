<template>
  <el-dialog :visible.sync="visible"
    width="700px"
    :close-on-click-modal="false"
    title="修改用户资料">
    <el-form
      v-loading="loading"
      :model="form"
      :rules="rules"
      ref="form"
      label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            v-for="item in [
              { label: '用户名', prop: 'username' },
              { label: '手机', prop: 'mobile' },
              { label: '签名', prop: 'signature'}
            ]"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label">
            <el-input v-model="form[item.prop]"></el-input>
          </el-form-item>
          <el-form-item
            label="性别"
            prop="sex">
            <el-select v-model="form.sex">
              <el-option :value="1" label="男"></el-option>
              <el-option :value="2" label="女"></el-option>
              <el-option :value="0" label="未知"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="封面"
            prop="avatar">
            <img-cropper
              :src.sync="form.avatar"
              :height="185"
              type="user"
              :ratio="1"></img-cropper>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getUserProfile, updateUserProfile } from '@/api/user'

export default {
  props: ['uid'],
  data () {
    return {
      visible: false,
      loading: false,
      btnLoading: false,
      form: {
        avatar: '',
        mobile: '',
        sex: 0,
        uid: '',
        signature: '',
        username: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
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
      getUserProfile(this.uid).then(res => {
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
      updateUserProfile(form).finally(() => {
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
