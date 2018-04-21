<template>
  <label
    class="uploader-wrapper"
    @dragover="dragover"
    @drop="drop">
    <template v-if="src">
      <img v-if="innerType === 'image'" :src="src">
      <audio v-if="innerType === 'audio'"
        :src="src"
        controls
        autoplay></audio>
      <span v-if="innerType === 'json'">{{src}}</span>
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
      default: 'image',
      validator: function (value) {
        const arr = ['image', 'sound', 'audio', 'json']
        return arr.indexOf !== -1
      }
    }
  },
  data () {
    return {
      src: this.url
    }
  },
  computed: {
    innerType () {
      return this.type === 'sound' ? 'audio' : this.type
    }
  },
  watch: {
    url (val) {
      this.src = val
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
        const typeMap = {
          image: /^image\//,
          audio: /^audio\//,
          json: /\/json/
        }
        if (typeMap[this.innerType].test(file.type)) {
          if (this.innerType === 'json') {
            this.src = file.name
            resolve()
          } else {
            const reader = new FileReader()
            reader.onload = () => {
              this.src = reader.result
              resolve()
            }
            reader.onerror = reject
            reader.onabort = reject
            reader.readAsDataURL(file)
          }
          this.$emit('upload', file)
        } else {
          const err = new Error()
          err.message = `${file.type}格式, 请选择${this.innerType}格式文件`
          reject(err)
        }
      }).catch(err => {
        this.$message.error(err && err.message ? err.message : err)
      })
    },
    reset () {
      if (this.src) {
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
  height: 135px;
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
