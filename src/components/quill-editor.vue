<template>
  <div class="quill-wrapper">
    <nav class="quill-toolbar">
      <button @click="undo">
        <svg-icon icon="undo"></svg-icon>
      </button>
      <button @click="redo">
        <svg-icon icon="redo"></svg-icon>
      </button>
      <button @click="read">
        <svg-icon icon="image"></svg-icon>
      </button>
    </nav>
    <div class="quill-container" ref="editor"></div>
    <div class="quill-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
    <input type="file"
      accept="image/jpeg,image/png,image/jpg,image/gif"
      style="display:none;"
      ref="iptfile"
      @change="uploadImage">
  </div>
</template>

<script>
import { uploadImg } from '@/api/upload'
import { loadScript, loadStyle } from '@/utils/index'

export default {
  props: {
    value: {
      default: ''
    },
    imageData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      quill: null,
      content: ''
    }
  },
  watch: {
    value (val) {
      if (this.quill) {
        if (val && val !== this.content) {
          this.content = val
          this.setContents(val)
        } else if (!val) {
          this.quill.setText('')
        }
      }
    }
  },
  mounted () {
    Promise.all([
      loadStyle('//unpkg.com/quill@1.3.6/dist/quill.core.css'),
      loadScript('//unpkg.com/quill@1.3.6/dist/quill.core.js')
    ]).then(res => {
      this.imageBlot(window.Quill)
      this.init(window.Quill)
    })
  },
  methods: {
    imageBlot (Quill) {
      let BlockEmbed = Quill.import('blots/block/embed')

      class ImageBlot extends BlockEmbed {
        static create (value) {
          let node = super.create()
          node.setAttribute('src', value)
          return node
        }

        static value (node) {
          return node.getAttribute('src')
        }
      }
      ImageBlot.blotName = 'image'
      ImageBlot.tagName = 'IMG'
      Quill.register(ImageBlot)
    },
    init (Quill) {
      this.quill = new Quill(this.$refs.editor, {
        modules: {
          history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true
          }
        }
      })
      this.setContents(this.value)

      this.quill.on('text-change', (delta, oldDelta, source) => {
        this.content = this.getContents()
        this.$emit('input', this.content)
      })
    },
    setContents (val) {
      if (Array.isArray(val)) {
        this.quill.setContents(val)
      } else if (typeof val === 'string') {
        this.quill.clipboard.dangerouslyPasteHTML(val)
      }
    },
    getContents () {
      let content = this.value
      if (Array.isArray(this.value)) {
        content = this.quill.getContents().ops
      } else if (typeof this.value === 'string') {
        content = this.$refs.editor.children[0].innerHTML
      }
      return content
    },
    undo () {
      this.quill.history.undo()
    },
    redo () {
      this.quill.history.redo()
    },
    read () {
      this.$refs.iptfile.click()
    },
    uploadImage (event) {
      const files = event.currentTarget.files
      if (files && files[0]) {
        uploadImg(files[0], this.imageData).then((res) => {
          this.$message.success('上传成功')
          const range = this.quill.getSelection(true)
          const Delta = this.quill.constructor.import('delta')
          this.quill.updateContents(new Delta()
            .retain(range.index)
            .delete(range.length)
            .insert({ image: 'https://image.iqing.in' + res + '-illustration' }))
        }).catch(err => {
          console.error(err)
          this.$message.error('上传失败')
        })
      }
    }
  }
}
</script>

<style lang="scss">
.quill-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.quill-toolbar {
  border: 1px solid #ccc;
  border-bottom: 0;
  padding: 10px;
  overflow: hidden;
  flex: none;
  button {
    float: left;
    cursor: pointer;
    padding: 3px 5px;
    margin: 0 3px;
    background: none;
    border: none;
    outline: none;
    &:hover {
      color: #06c;
    }
  }
}

.quill-footer {
  padding: 10px;
  border: 1px solid #ccc;
  border-top: 0;
}

.quill-container {
  background-color: #fbfaf8;
  border: 1px solid #ccc;
  overflow: hidden;
  flex: 1;
  .ql-editor p {
    font-size: 16px;
    line-height: 1.6;
    text-indent: 2em;
    margin: 0.8em 0;
    color: #1f2a3d;
  }
  img {
    max-height: 500px;
    max-width: 100%;
    display: block;
    background: #fff;
    border: 1px solid #ddd;
    padding: 8px;
    margin: 8px;
  }
}
</style>
