<template>
  <el-dialog :title="title" :visible.sync="visible" @open="getContent" @close="close">
    <div class="chapter-content" v-html="content"></div>
  </el-dialog>
</template>

<script>
import { getChapterDraftContent, getChapterDraftDetail, getChapterContent, getChapterDetail } from '@/api/book-review'
import _escape from 'lodash/escape'

export default {
  props: ['id', 'draft'],
  data () {
    return {
      content: 'loading...',
      title: 'loading...',
      visible: false
    }
  },
  methods: {
    getContent () {
      let getTitle
      let getContent
      if (this.draft) {
        getTitle = getChapterDraftDetail(this.id)
        getContent = getChapterDraftContent(this.id)
      } else {
        getTitle = getChapterDetail(this.id)
        getContent = getChapterContent(this.id)
      }
      getTitle.then(res => {
        this.title = res.title
      }).catch(() => {
        this.title = '获取标题失败'
      })
      getContent.then(res => {
        let html = ''
        res.results.forEach(item => {
          if (item.type === 1) {
            html += `<img class="img-thumbnail" src="${_escape(item.value)}-illustration">`
          } else {
            const arr = item.value.split(/\n/)
            arr.forEach(ph => {
              html += `<p>${_escape(ph)}</p>`
            })
          }
        })
        this.content = html
      }).catch(() => {
        this.content = '<p style="color:red;text-align: center">获取内容失败</p>'
      })
    },
    close () {
      this.content = 'loading...'
      this.title = 'loading...'
    }
  }
}
</script>

<style lang="scss" scoped>
.chapter-content {
  p {
    text-indent: 2em;
    font-size: 16px;
    line-height: 1.7;
    padding: .4em 0;
    margin: 0;
    color: #333;
    word-break: break-word;
    position: relative;
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
