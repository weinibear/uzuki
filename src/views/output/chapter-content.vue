<template>
  <quill-editor v-model="content" :image-data="options">
    <el-button
      slot="footer"
      type="success"
      :loading="btnLoading"
      @click="save">保存</el-button>
  </quill-editor>
</template>

<script>
import { getContent, updateContent } from '@/api/output'
import { content2delta, delta2content } from './parse-content'

export default {
  data () {
    return {
      content: [],
      btnLoading: false
    }
  },
  created () {
    this.getData()
  },
  computed: {
    cid () {
      return this.$route.params.cid
    },
    options () {
      return {
        type: 'recommend'
      }
    }
  },
  methods: {
    getData () {
      return getContent(this.cid).then(res => {
        this.content = content2delta(res.results)
      })
    },
    save () {
      const results = delta2content(this.content)
      if (results.length === 0) {
        return this.$message({
          type: 'error',
          message: '没有可用于提交的内容',
          showClose: true
        })
      }
      this.btnLoading = true
      updateContent(this.cid, results).then(() => {
        this.$message.success('更新成功')
      }).finally(() => {
        this.btnLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-save {
  position: absolute;
  top: 0;
  right: 20px;
}
</style>
