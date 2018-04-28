<template>
  <el-dialog
    title="模板编辑"
    width="550px"
    top="5vh"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form
      label-width="80px"
      :model="form"
      ref="form">
      <el-form-item label="选择模板" prop="type">
        <el-select v-model="form.type">
          <el-option label="图片模块" value="image"></el-option>
          <el-option label="混排模块" value="hybrid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="跳转链接" prop="linkUrl">
        <el-input v-model="form.linkUrl" placeholder="请输入地址URL(留空为不跳转)"></el-input>
      </el-form-item>
      <template v-if="form.type === 'hybrid'">
        <el-form-item label="标题内容" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="图片位置" prop="imageLocation">
          <el-select v-model="form.imageLocation" >
            <el-option label="左侧" value="left"></el-option>
            <el-option label="右侧" value="right"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文字内容" prop="content">
          <el-input type="textarea" :rows="5" v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="按钮文本" prop="buttonText">
          <el-input v-model="form.buttonText"></el-input>
        </el-form-item>
      </template>
      <el-form-item label="上传图片">
        <img-cropper :src="form.imageUrl"
          @update:src="upload"
          :ratio="ratio"></img-cropper>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    data: Object
  },
  data () {
    return {
      visible: false,
      form: {
        cid: 1,
        type: 'hybrid',
        imageUrl: '',
        linkUrl: '',
        imageLocation: 'left',
        buttonText: '',
        title: '',
        content: ''
      }
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
        const type = this.form.type
        this.$refs.form.resetFields()
        this.form.type = type
      }
    }
  },
  computed: {
    ratio () {
      if (this.form.type === 'image') {
        return 2 / 1
      }
      return 3 / 4
    }
  },
  methods: {
    upload (url) {
      this.form.imageUrl = 'https://image.iqing.com' + url
    },
    save () {
      const content = { ...this.form }
      this.$emit('save', content)
      this.visible = false
    }
  }
}
</script>
