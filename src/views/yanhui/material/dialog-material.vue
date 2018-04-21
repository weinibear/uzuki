<template>
  <el-dialog
    width="700px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :title="title">
    <el-form
      :model="form"
      ref="form"
      label-width="6em">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label-width="1em"
            label=''
            :rules="{ required: true, message: '文件不能为空' }"
            prop="file">
            <upload-preview
              ref="preview"
              :url="url"
              :type="sourceType"
              @upload="form.file = arguments[0]"></upload-preview>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="素材名字"
            prop="title"
            :rules="{ required: true, message: '名字不能为空' }">
            <el-input v-model="form.title" placeholder="请输入素材名字"></el-input>
          </el-form-item>
          <el-form-item
            label="素材类别"
            prop="type">
            <el-select v-model="form.type" @change="changeTag('type')">
              <el-option
                v-for="(item, key) in useTypes"
                :label="item.name"
                :value="key"
                :key="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-show="isImage"
            label="素材属性"
            prop="pic_type">
            <el-select v-model="form.pic_type">
              <el-option
                v-for="(item, index) in picTypes"
                :label="item"
                :value="index"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="一级标签">
        <el-select v-model="form.taglevel1" @change="changeTag('taglevel1')">
          <el-option v-for="tag in tags1" :key="tag.id" :value="tag.id" :label="tag.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级标签">
        <el-select v-model="form.taglevel2" @change="changeTag('taglevel2')">
          <el-option v-for="tag in tags2" :key="tag.id" :value="tag.id" :label="tag.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级标签">
        <el-select v-model="form.taglevel3" @change="changeTag('taglevel3')">
          <el-option v-for="tag in tags3" :key="tag.id" :value="tag.id" :label="tag.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="角标绑定">
        <el-select v-model="form.badge">
          <el-option v-for="tag in badges" :key="tag.id" :value="tag.id" :label="tag.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="save"
        :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { useTypes, picTypes } from './options'
import { getMaterialTags, getBadgetag } from '@/api/yanhui/tag'
import { uploadMaterial, editMaterial } from '@/api/yanhui/material'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      useTypes,
      picTypes,
      visible: false,
      btnLoading: false,
      tags: [],
      badges: [],
      sourceType: 'image',
      url: '',
      form: {
        type: '',
        pic_type: 0,
        title: '',
        taglevel1: '',
        taglevel2: '',
        taglevel3: '',
        badge: '',
        file: ''
      }
    }
  },
  computed: {
    isImage () {
      return this.form.type && useTypes[this.form.type] && useTypes[this.form.type].type === 'image'
    },
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改素材' : '添加素材'
    },
    tags1 () {
      return this.tags[this.form.type] || []
    },
    tags2 () {
      let tags = []
      if (this.tags1.length && this.form.taglevel1) {
        const item = this.tags1.find(tag => tag.id === this.form.taglevel1)
        tags = (item && item.content) || []
      }
      return tags
    },
    tags3 () {
      let tags = []
      if (this.tags2.length && this.form.taglevel2) {
        const item = this.tags1.find(tag => tag.id === this.form.taglevel2)
        tags = (item && item.content) || []
      }
      return tags
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
            this.url = this.data.link
            this.sourceType = this.data.sourceType
          })
        }
      } else {
        this.url = ''
        this.$refs.preview.reset()
        this.$refs.form.resetFields()
      }
    }
  },
  created () {
    getMaterialTags().then(list => {
      this.tags = list
    })
    getBadgetag().then(res => {
      this.badges = res.results
    })
  },
  methods: {
    changeTag (key) {
      const keys = ['type', 'taglevel1', 'taglevel2', 'taglevel3']
      const index = keys.indexOf(key)
      keys.forEach((v, i) => {
        if (i > index) {
          this.form[v] = ''
        }
      })
    },
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submit()
        }
      })
    },
    submit () {
      this.btnLoading = true
      const fd = new window.FormData()
      const form = { ...this.form }
      if (!this.isImage) {
        delete form.pic_type
      }
      const type = useTypes[this.form.type].type
      Object.keys(form).forEach(v => {
        if (form[v]) {
          fd.append(v, form[v])
        }
      })
      Promise.resolve(
        this.id
          ? editMaterial(this.id, fd, type)
          : uploadMaterial(fd, type)
      ).finally(() => {
        this.btnLoading = false
      }).then(() => {
        this.$message.success('保存成功')
        this.visible = false
        this.$emit('success')
      })
    }
  }
}
</script>
