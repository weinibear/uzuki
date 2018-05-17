<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"

    title="添加素材">
    <el-form
      :model="form"
      ref="form"
      label-width="80px">
      <el-form-item
        label="类型"
        prop="type">
        <el-select v-model="form.type" placeholder="请选择活动区域">
          <el-option
            v-for="(item, index) in types"
            :key="index"
            :value="index"
            :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="名称"
        prop="name"
        :rules="{ required: true, message: '名字不能为空' }">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item
        label='上传图片'
        :rules="{ required: true, message: '文件不能为空' }"
        prop="file">
        <upload-preview
          ref="preview"
          @upload="form.file = arguments[0]"></upload-preview>
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
        type: 0,
        name: '',
        file: ''
      }
    }
  },
  computed: {
    picType () {
      return parseInt(this.$route.params.type, 10)
    },
    types () {
      const typesMap = {
        1: ['身体', '表情', '其他'],
        2: ['身体层', '表情层', '配件层']
      }
      return typesMap[this.picType]
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        this.$refs.preview.reset()
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
