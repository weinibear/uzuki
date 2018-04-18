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
        label="标题"
        prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item
        label="简介"
        prop="intro">
        <el-input type="textarea" :rows="6" v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item
        label="价格"
        prop="amount">
        <el-input v-model="form.amount"></el-input>
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
import { editChapter } from '@/api/yanhui/game'

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
        intro: '',
        amount: 0
      }
    }
  },
  computed: {
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改章节' : '添加章节'
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.data) {
          this.$nextTick().then(() => {
            Object.keys(this.form).forEach(key => {
              if (this.data.hasOwnProperty(key)) {
                this.form[key] = this.data[key]
              }
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
      Promise.resolve(
        this.id
          ? editChapter(this.id, form)
          : null
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
