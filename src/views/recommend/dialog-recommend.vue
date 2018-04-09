<template>
  <el-dialog
    width="700px"
    :visible.sync="visible"
    :title="title">
    <el-form
      :model="form"
      ref="form"
      label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item
            v-for="item in [
              { label: '标题', prop: 'title'},
              { label: 'ID', prop: 'work_id'},
              { label: '链接', prop: 'href'},
              { label: '推荐词', prop: 'recommend_words'},
              { label: '序号', prop: 'order' }
            ]"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop">
            <el-input v-model="form[item.prop]" />
          </el-form-item>
          <el-form-item
            label="启用"
            key="status">
            <base-switch
              v-model="form.status"
              :active-value="1"
              :inactive-value="0">
            </base-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            v-for="item in [
              { label: '类型', prop: 'type', options: recomType },
              { label: '分区', prop: 'channel', options: recomChannel },
              { label: '分类', prop: 'work_type', options: recomWorkType }
            ]"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop">
            <el-select v-model="form[item.prop]">
              <el-option
                v-for="option in item.options"
                :key="option.value"
                :label="option.name"
                :value="option.value"/>
            </el-select>
          </el-form-item>
          <el-form-item
            label="封面"
            prop="cover">
            <img-cropper :src.sync="form.cover"></img-cropper>
          </el-form-item>
        </el-col>
      </el-row>
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
import { editRecom, addRecom } from '@/api/recommend'
import { recomType, recomChannel, recomWorkType } from './options'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      recomType,
      recomChannel,
      recomWorkType,
      visible: false,
      btnLoading: false,
      form: {
        channel: '',
        cover: '',
        order: 0,
        recommend_words: '',
        status: 0,
        title: '',
        type: '',
        work_id: '',
        work_type: '',
        href: ''
      }
    }
  },
  computed: {
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改推荐' : '添加推荐'
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
          })
        }
      } else {
        this.$refs.form.resetFields()
      }
    }
  },
  methods: {
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
      form.work_id = parseInt(form.work_id, 10)
      form.order = parseInt(form.order, 10)
      Object.keys(form).forEach(key => {
        if (form[key] === '') {
          delete form[key]
        }
      })
      Promise.resolve(
        this.id
          ? editRecom(this.id, form)
          : addRecom(form)
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
