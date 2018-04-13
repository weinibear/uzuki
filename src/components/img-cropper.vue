<template>
  <div class="cropper">
    <label
      @dragover="dragover"
      @drop="drop"
      class="img-wrapper"
      for="ipt-img-cropper"
      :style="{width: labelWidth + 'px', height: labelHeight + 'px'}">
      <img v-if="imgSrc" :src="imgSrc">
      <svg-icon v-else icon="plus"></svg-icon>
    </label>
    <input @change="change" type="file" id="ipt-img-cropper">
    <el-dialog :visible.sync="visible"
      :width="dialogWidth + 'px'"
      top="10vh"
      :modal="false"
      :close-on-click-modal="false">
      <div>
        <img ref="image" :src="url" alt="" @load="start">
      </div>
      <div class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="upload">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { uploadImg } from '@/api/upload'
import '@/utils/canvas-to-blob'

export default {
  name: 'ImgCropper',
  props: {
    src: String,
    ratio: {
      type: Number,
      default: 3 / 4
    },
    labelHeight: {
      type: Number,
      default: 148
    },
    type: {
      type: String,
      default: 'recommend'
    },
    options: {}
  },
  data () {
    return {
      visible: false,
      labelWidth: this.labelHeight * this.ratio,
      dialogWidth: 600 * this.ratio,
      prevUrl: '',
      url: '',
      cropper: null,
      btnLoading: false
    }
  },
  computed: {
    imgSrc () {
      if (this.src && !/^(https?:)?\/\//.test(this.src)) {
        return '//image.iqing.com/' + this.src.replace(/^\//, '')
      }
      return this.src
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        this.stop()
      }
    }
  },
  methods: {
    dragover (e) {
      e.preventDefault()
    },
    drop (e) {
      e.preventDefault()
      this.read(e.dataTransfer.files)
    },
    change (e) {
      const files = e.target.files
      this.read(files).finally(() => {
        e.target.value = ''
      })
    },
    read (files) {
      return new Promise((resolve, reject) => {
        if (!files || files.length === 0) {
          resolve()
          return
        }
        const file = files[0]
        if (/^image\/\w+$/.test(file.type)) {
          const reader = new FileReader()
          reader.onload = () => {
            this.url = reader.result
            if (this.url === this.prevUrl) {
              this.start()
            }
            this.visible = true
            resolve()
          }
          reader.onerror = reject
          reader.onabort = reject
          reader.readAsDataURL(file)
        } else {
          const err = new Error()
          err.message = '请选择图片格式文件'
          reject(err)
        }
      }).catch(err => {
        this.$message.error(err && err.message ? err.message : err)
        throw err
      })
    },
    start () {
      const options = {
        aspectRatio: this.ratio,
        viewMode: 1,
        zoomOnWheel: false,
        autoCropArea: 1
      }
      this.cropper = new Cropper(this.$refs.image, {...options, ...this.options})
    },
    stop () {
      if (this.cropper) {
        this.cropper.destroy()
        this.cropper = null
        this.prevUrl = this.url
      }
    },
    upload () {
      const canvas = this.cropper.getCroppedCanvas()
      canvas.toBlob(file => {
        this.btnLoading = true
        const data = {
          type: this.type
        }
        uploadImg(file, data).then(url => {
          this.$emit('update:src', url)
          this.$message.success('上传成功')
          this.visible = false
        }).finally(() => {
          this.btnLoading = false
        })
      }, 'image/jpeg')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/var';
.cropper {
  display: inline-block;
  img {
    max-width: 100%;
  }
}
.img-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: content-box;
  border: 1px dashed #d9d9d9;
  color: #d9d9d9;
  font-size: 20px;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    border-color: mix(#fff, $--color-primary, 30%);
    color: mix(#fff, $--color-primary, 30%);
  }
}
#ipt-img-cropper {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  opacity: 0;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
.dialog-footer {
  text-align: center;
  margin-top: 20px;
}
</style>
