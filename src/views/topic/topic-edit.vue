<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-button type="primary" :loading="btnLoading" @click="save">提交</el-button>
      <json-editor class="ipt" ref="editor" v-model="content"></json-editor>
    </el-col>
    <el-col :span="12">
      <el-upload
        ref="upload"
        action="/tunnel/"
        :data="{type:'recommend'}"
        :headers="headers"
        multiple
        :auto-upload="false"
        :on-change="getUrls"
        :on-remove="getUrls"
        :on-preview="handlePreview">
        <el-button slot="trigger" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" type="success" @click="submitUpload">上传到服务器</el-button>
      </el-upload>
      <el-input class="ipt"
        placeholder="这里显示上传成功的图片"
        readonly
        v-model="fileUrls"
        type="textarea"
        :rows="5"></el-input>
      <input class="ipt-url" ref="url" type="text" v-model="currentImg" readonly>
    </el-col>
  </el-row>
</template>

<script>
import { getTopicDetail, updateTopic } from '@/api/topic'
import { formatJSON, isValidJSON } from '@/utils/index'
import cookie from 'js-cookie'

export default {
  data () {
    const headers = {
      'X-CSRFToken': cookie.get('csrftoken')
    }
    if (process.env.NODE_ENV !== 'production') {
      headers['X-Dev'] = 'on'
    }
    return {
      headers,
      currentImg: '',
      content: '',
      fileUrls: '',
      btnLoading: false
    }
  },
  computed: {
    id () {
      return this.$route.params.id
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    getDetail () {
      return getTopicDetail(this.id).then(res => {
        this.content = formatJSON(res.content, 2)
      })
    },
    getUrls (file, fileList) {
      const results = fileList.map(v => v.response).join('\n')
      this.fileUrls = results
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    save () {
      if (!isValidJSON(this.content)) {
        return this.$message.warning('无效的格式')
      }
      this.btnLoading = true
      const content = formatJSON(this.content, 2)
      updateTopic(this.id, { content }).then(() => {
        this.$message.success('更新成功')
      }).finally(() => {
        this.btnLoading = false
      })
    },
    handlePreview (file) {
      this.currentImg = file.response
      this.$nextTick(() => {
        this.$refs.url.select()
        try {
          const successful = document.execCommand('copy')
          if (successful) {
            this.$message.success('复制成功')
          } else {
            this.$message.warning('复制失败')
          }
        } catch (error) {
          this.$message.error('自动复制失败，Ctrl + C复制')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.ipt {
  margin-top: 10px;
}
.ipt-url {
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
