<template>
  <div ref="editor" class="editor">
    <span class="loading">{{editorText}}</span>
  </div>
</template>

<script>
import { loadScript, formatJSON } from '@/utils'

export default {
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      editor: null,
      editorText: '编辑器加载中...'
    }
  },
  watch: {
    value: 'setValue'
  },
  methods: {
    initEditor () {
      return loadScript('https://cdn.bootcss.com/ace/1.2.9/ace.js').then(() => {
        const editor = window.ace.edit(this.$refs.editor)
        editor.$blockScrolling = Infinity // clear the console info
        editor.getSession().setMode('ace/mode/json')
        editor.getSession().setUseWrapMode(true)
        editor.getSession().setTabSize(2)
        this.editor = editor
        this.setValue()
        this.bindEvent(editor)
        this.formatCommand(editor)
      }, () => {
        this.editorText = '编辑器加载失败,检查网络,刷新重试'
      })
    },
    setValue () {
      if (this.editor) {
        const posi = this.editor.getCursorPosition()
        this.editor.setValue(this.value)
        this.editor.navigateTo(posi.row, posi.column)
      }
    },
    bindEvent (editor) {
      editor.on('blur', () => {
        this.$emit('input', editor.getValue())
      })
    },
    format (editor) {
      const posi = editor.getCursorPosition()
      let value = editor.getValue()
      value = formatJSON(value)
      editor.setValue(value)
      editor.navigateTo(posi.row, posi.column)
    },
    // 自定义快捷键 格式化
    formatCommand (editor) {
      editor.commands.addCommand({
        name: 'format',
        bindKey: {win: 'Ctrl-M', mac: 'Command-M'},
        exec: this.format,
        readOnly: false
      })
    }
  },
  created () {
    this.initEditor()
  },
  beforeDestroy () {
    this.editor.destroy()
    this.editor = null
  }
}
</script>

<style lang="scss" scoped>
.editor {
  position: relative;
  width: 100%;
  height: 400px;
  height: calc(100vh - 240px);
  border: 1px solid #eee;
  font-size: 14px;
  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
    font-size: 30px;
  }
}
</style>
