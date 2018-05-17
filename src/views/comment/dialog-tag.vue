<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    :title="title">
    <el-form
      :model="form"
      ref="form"
      label-width="80px">
      <el-form-item label="类型"
        prop="type">
        <el-select v-model="form.type">
          <el-option label="文字" :value="0"></el-option>
          <el-option label="图片" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="内容"
        prop="value"
        :rules="{ required: true, message: '名字不能为空' }">
        <el-input v-show="form.type === 0" v-model="form.value"></el-input>
        <img-cropper v-show="form.type === 1" :src.sync="form.value" :ratio="NaN"></img-cropper>
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
import { createTag, updateTag } from '@/api/comment'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      visible: false,
      btnLoading: false,
      form: {
        type: 0,
        value: ''
      }
    }
  },
  computed: {
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改标签' : '添加标签'
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
      if (form.type === 1) {
        form.value = form.value.replace(/^https?:\/\/[^/]+/, '')
      }
      Promise.resolve(
        this.id
          ? updateTag(this.id, form)
          : createTag(form)
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
