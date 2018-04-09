<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    :title="title">
    <el-form
      :model="form"
      ref="form"
      label-width="60px">
      <el-form-item
        label="标题"
        prop="title"
        :rules="{ required: true, message: '标题不能为空' }">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item
        label="简介"
        prop="intro"
        :rules="{ required: true, message: '简介不能为空' }">
        <el-input v-model="form.intro"
          type="textarea"
          :rows="5"></el-input>
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
import { addBooklist, editBooklist } from '@/api/booklist'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      visible: false,
      btnLoading: false,
      form: {
        title: '',
        intro: ''
      }
    }
  },
  computed: {
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改书单' : '添加书单'
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
      Promise.resolve(
        this.data
          ? editBooklist(this.data.id, this.form)
          : addBooklist(this.form)
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
