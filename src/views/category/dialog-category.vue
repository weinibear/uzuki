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
        label="类名"
        prop="name"
        :rules="{ required: true, message: '名字不能为空' }">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序"
        prop="order">
        <el-input v-model.number="form.order"></el-input>
      </el-form-item>
      <el-form-item
        label="封面"
        prop="cover">
        <img-cropper :src.sync="form.cover" :ratio="1"></img-cropper>
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
import { changeCategory, addCategory } from '@/api/category'

const form = {
  name: '',
  order: 0,
  cover: ''
}

export default {
  props: {
    data: Object
  },
  data () {
    return {
      visible: false,
      btnLoading: false,
      form: { ...form }
    }
  },
  computed: {
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改分类' : '添加分类'
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
          ? changeCategory(this.id, this.form)
          : addCategory(this.form)
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
