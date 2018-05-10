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
        prop="title"
        :rules="{ required: true, message: '标题不能为空' }">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item
        label="作者的话"
        prop="whisper">
        <el-input v-model="form.whisper"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type">
          <el-option v-for="item in chapterType"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="序号" prop="order">
        <el-input-number v-model="form.order"></el-input-number>
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
import { updateChapter, createChapter } from '@/api/book'
import { chapterType } from './options'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      chapterType,
      visible: false,
      btnLoading: false,
      form: {
        order: 0,
        title: '',
        whisper: '',
        type: 1
      }
    }
  },
  computed: {
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改章节' : '添加章节'
    },
    vid () {
      return this.$route.params.vid
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
      Promise.resolve(
        this.id
          ? updateChapter(this.id, form)
          : createChapter(this.vid, form)
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
