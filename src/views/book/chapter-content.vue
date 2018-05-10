<template>
  <quill-editor v-loading="loading" v-model="content" :image-data="options">
    <el-button
      slot="footer"
      type="success"
      :loading="btnLoading"
      @click="save">保存</el-button>
  </quill-editor>
</template>

<script>
import { getContent, updateContent } from '@/api/book'
import { content2delta, delta2content } from '../output/parse-content'

export default {
  data () {
    return {
      content: [],
      loading: false,
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
        type: 'content',
        chapter_id: this.cid
      }
    }
  },
  methods: {
    getData () {
      this.loading = true
      return getContent(this.cid).then(res => {
        this.content = content2delta(res.results)
      }).finally(() => {
        this.loading = false
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
      const data = { content: results }
      this.btnLoading = true
      updateContent(this.cid, data).then(() => {
        this.$message.success('更新成功')
      }).finally(() => {
        this.btnLoading = false
      })
    }
  }
}
</script>
