<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="form"
    label-width="100px">
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item
          label="活动标题"
          prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item
          v-if="isActivity"
          label="时间选择">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="序号"
          prop="order">
          <el-input v-model.number="form.order"></el-input>
        </el-form-item>
        <el-form-item
          label="封面"
          prop="cover">
          <img-cropper :src.sync="form.cover" :ratio="10/3"></img-cropper>
        </el-form-item>
        <el-form-item
          class="item-inline"
          v-for="item in [
            { prop: 'works_display', label: '作品区状态' },
            { prop: 'bf_enable', label: '讨论区状态' },
            { prop: 'submit_enable', label: '投稿状态' },
            { prop: 'enabled', label: '活动状态' },
          ]"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label">
          <el-switch v-model="form[item.prop]"></el-switch>
        </el-form-item>
        <el-form-item
          v-if="isActivity"
          class="item-inline"
          v-for="item in [
            { prop: 'pcenabled', label: 'PC端状态' },
            { prop: 'exenabled', label: '客户端状态' }
          ]"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label">
          <el-switch v-model="form[item.prop]"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="success"
            :loading="btnLoading"
            @click="save">保存</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <template v-if="version === 2">
          <el-form-item
            label="外链地址"
            prop="url">
            <el-input v-model.trim="url" placeholder="可选"></el-input>
          </el-form-item>
          <el-form-item label="活动内容">
            <el-button icon="el-icon-plus" type="primary" @click="addModule">添加模板</el-button>
            <v-draggable v-model="content" element="ul">
              <li v-for="(item, index) in content"
                class="module-item"
                :key="item.cid">
                <img class="module-image" v-if="item.type === 'image'"
                  :src="item.imageUrl | image" alt="图片挂了">
                <template v-else>
                  <img v-if="item.imageUrl"
                    :src="item.imageUrl | image"
                    :style="{ 'float': item.imageLocation }"
                    alt="图片挂了">
                  <div class="module-content">
                    <h5 class="title">{{item.title}}</h5>
                    <div class="content">{{item.content}}</div>
                    <el-button
                      v-if="item.buttonText"
                      style="margin-top: 10px"
                      :style="{ 'float': item.imageLocation === 'left' ? 'right' : 'left'}">
                      {{item.buttonText}}</el-button>
                  </div>
                </template>
                <div class="tool">
                  <el-button size="mini"
                    plain
                    icon="el-icon-edit"
                    @click="editModule(index)">编辑</el-button>
                  <el-button size="mini"
                    plain
                    type="danger"
                    icon="el-icon-delete"
                    @click="delModule(index)">删除</el-button>
                </div>
              </li>
            </v-draggable>
          </el-form-item>
        </template>
        <el-form-item label="活动内容" v-else>
          <el-input type="textarea"
            :rows="8"
            v-model="form.content"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <dialog-module
      ref="dialogModule"
      :data="current"
      @save="updateContent"></dialog-module>
  </el-form>
</template>

<script>
import DialogModule from './dialog-module'
import { getActivity, createActivity, updateActivity } from '@/api/activity'
import { getSubject, createSubject, updateSubject } from '@/api/subject'
import VDraggable from 'vuedraggable'

export default {
  components: { DialogModule, VDraggable },
  data () {
    const tomorrow = new Date().setHours(12, 0, 0, 0)
    return {
      btnLoading: false,
      maxCid: 1,
      contentIndex: -1,
      content: [],
      url: '', // 外链url
      version: 2, // 1 是旧 2 是新
      form: {
        title: '',
        eve_url: 'https://www.iqing.com',
        started_time: tomorrow,
        ended_time: tomorrow + 7 * 24 * 3600 * 1000,
        content: '',
        cover: '',
        order: 0,
        works_display: true,
        bf_enable: true,
        submit_enable: false,
        enabled: false,
        pcenabled: false,
        exenabled: false
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        cover: [
          { required: true, message: '请上传封面', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    id () {
      return parseInt(this.$route.params.id)
    },
    isActivity () {
      return this.$route.name === '活动详情'
    },
    current () {
      return this.contentIndex >= 0 ? this.content[this.contentIndex] : { cid: this.maxCid }
    },
    time: {
      get () {
        return [
          new Date(this.form.started_time),
          new Date(this.form.ended_time)
        ]
      },
      set (val) {
        if (val) {
          this.form.started_time = val[0].getTime()
          this.form.ended_time = val[1].getTime()
        } else {
          this.form.started_time = Date.now()
          this.form.ended_time = Date.now()
        }
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    const id = parseInt(to.params.id, 10)
    if (id > 0) {
      Promise.resolve(
        to.name === '活动详情'
          ? getActivity(id)
          : getSubject(id)
      ).then(res => {
        next(vm => vm.setData(res))
      })
    } else {
      next()
    }
  },
  beforeRouteUpdate (to, from, next) {
    const id = parseInt(to.params.id, 10)
    if (id > 0) {
      Promise.resolve(
        to.name === '活动详情'
          ? getActivity(id)
          : getSubject(id)
      ).then(res => {
        this.setData(res)
        next()
      })
    } else {
      this.$refs.form.resetFields()
      this.version = 2
      this.content = []
      this.url = ''
      next()
    }
  },
  filters: {
    image (val) {
      return val.replace(/^https?:/, '') + '?imageView2/2/h/150'
    }
  },
  methods: {
    setData (res) {
      Object.keys(this.form).forEach(key => {
        this.form[key] = res[key]
      })
      try {
        let data = JSON.parse(this.form.content)
        if (data.type === 'common') {
          this.version = 2
          this.content = data.content
          this.content.forEach((v, i) => {
            v.cid = i + 1
          })
          this.maxCid = this.content.length + 1
          this.url = data.url || ''
        } else {
          this.version = 1
        }
      } catch (error) {
        console.error(error.message)
        this.$message.error('JSON解析出错, 不要修改保存数据!')
        this.content = []
      }
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
      const form = { ...this.form }
      form.content = JSON.stringify({ content: this.content, type: 'common', url: this.url })
      form.cover = form.cover.replace(/https?:\/\/[^/]+/g, '')
      if (!this.isActivity) {
        delete form.started_time
        delete form.ended_time
        delete form.pcenabled
        delete form.exenabled
      }
      Promise.resolve(
        this.isActivity
          ? this.id
            ? updateActivity(this.id, form)
            : createActivity(form)
          : this.id
            ? updateSubject(this.id, form)
            : createSubject(form)
      ).finally(() => {
        this.btnLoading = false
      }).then(() => {
        this.$message.success('保存成功')
        this.visible = false
        this.$emit('success')
      })
    },
    addModule () {
      this.contentIndex = -1
      this.$refs.dialogModule.visible = true
    },
    editModule (index) {
      this.contentIndex = index
      this.$refs.dialogModule.visible = true
    },
    delModule (index) {
      this.content.splice(index, 1)
    },
    updateContent (value) {
      if (this.contentIndex === -1) {
        this.content.push(value)
        this.maxCid++
      } else {
        this.content.splice(this.contentIndex, 1, value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/mixins.scss';
.module-item {
  position: relative;
  width: 300px;
  vertical-align: middle;
  margin-top: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  cursor: move;
  &:hover {
    .tool {
      display: block;
    }
  }
}
.tool {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: right;
  background: rgba(0, 0, 0, 0.4);
  vertical-align: top;
  display: none;
}
.item-inline {
  display: inline-block;
  width: 49%;
}
.content-wrapper {
  height: 300px;
  width: 300px;
}

.module-image {
  vertical-align: middle;
}
.module-content {
  font-size: 12px;
  overflow: hidden;
  padding: 0 10px;
  .title {
    margin-top: 0;
    margin-bottom: 5px;
    @include truncate;
  }
  .content {
    @include truncate(4);
    white-space: pre-line;
  }
}
</style>
