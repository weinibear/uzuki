<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    title="添加素材">
    <el-form
      :model="form"
      ref="form"
      label-width="100px">
      <el-form-item
        label="名称"
        prop="name"
        :rules="{ required: true, message: '名字不能为空' }">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item
        label='上传图片'
        :rules="{ required: true, message: '图片不能为空' }"
        prop="picture">
        <upload-preview
          ref="preview"
          @upload="form.picture = arguments[0]"></upload-preview>
      </el-form-item>
      <el-form-item
        label="上传JSON"
        prop="json"
        :rules="{ required: true, message: 'JSON不能为空' }">
        <upload-preview
          ref="previewJSON"
          type="image"
          @upload="form.json = arguments[0]"></upload-preview>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="save" :loading="btnLoading">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { uploadMaterialPart } from '@/api/yanhui/material'

export default {
  data () {
    return {
      visible: false,
      btnLoading: false,
      form: {
        name: '',
        picture: '',
        json: ''
      }
    }
  },
  computed: {
    picType () {
      return parseInt(this.$route.params.type, 10)
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        this.$refs.preview.reset()
        this.$refs.previewJSON.reset()
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
    uploadJSON (e) {
      const files = e.target.files
      if (!files || files.length === 0) {
        return
      }
      const file = files[0]
      this.form.json = file
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
      const fd = new window.FormData()
      const type = this.picType
      Object.keys(this.form).forEach(v => {
        if (this.form[v]) {
          fd.append(v, this.form[v])
        }
      })
      fd.append('parent', this.$route.params.parent)
      uploadMaterialPart(fd, type).finally(() => {
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
