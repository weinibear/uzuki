<template>
  <label
    class="uploader-wrapper"
    @dragover="dragover"
    @drop="drop">
    <template v-if="src">
      <img v-if="innerType === 'image'" :src="src" @load="revoke">
      <audio v-if="innerType === 'audio' || innerType === 'sound'"
        :src="src"
        controls
        autoplay></audio>
    </template>
    <span v-else>将文件拖到此处或点击上传</span>
    <input @change="change" type="file" class="ipt-uploader">
  </label>
</template>

<script>
export default {
  name: 'upload-preview',
  props: {
    url: {
      default: ''
    },
    type: {
      default: 'image'
    }
  },
  data () {
    return {
      src: this.url,
      innerType: this.type
    }
  },
  watch: {
    url (val) {
      this.revoke()
      this.src = val
      this.innerType = this.type
    }
  },
  beforeDestroy () {
    this.reset()
  },
  methods: {
    dragover (e) {
      e.preventDefault()
    },
    drop (e) {
      e.preventDefault()
      this.handleFiles(e.dataTransfer.files)
    },
    change (e) {
      const files = e.target.files
      this.handleFiles(files)
    },
    revoke () {
      window.URL.revokeObjectURL(this.src)
    },
    handleFiles (files) {
      if (!files || files.length === 0) {
        return
      }
      const file = files[0]
      const imageType = /^image\//
      const audioType = /^audio\//
      if (imageType.test(file.type)) {
        this.innerType = 'image'
      } else if (audioType.test(file.type)) {
        this.innerType = 'sound'
      } else {
        console.log('上传的文件类型: ', file.type)
        return this.$message.warn('无法识别上传文件类型')
      }
      this.src = window.URL.createObjectURL(file)
      this.$emit('upload', file)
    },
    reset () {
      if (this.src) {
        this.revoke()
        this.src = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/var';
.uploader-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 130px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    border-color: mix(#fff, $--color-primary, 30%);
    color: mix(#fff, $--color-primary, 30%);
  }
  img, audio {
    max-width: 100%;
    max-height: 100%;
  }
}
.ipt-uploader {
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
</style>
