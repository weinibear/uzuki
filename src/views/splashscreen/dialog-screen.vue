<template>
  <el-dialog
    width="600px"
    :visible.sync="visible"
    :title="title">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="80px">
      <el-form-item
        label="跳转链接"
        prop="link">
        <el-input v-model="form.link"></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          placeholder="选择时间范围">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="设备" prop="equipment">
        <el-select v-model="form.equipment">
          <el-option label="全部" :value="0"></el-option>
          <el-option label="IOS" :value="1"></el-option>
          <el-option label="Android" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status">
        <el-switch :active-value="1" :inactive-value="0" v-model="form.status"></el-switch>
      </el-form-item>
      <el-form-item
        label="图片"
        prop="image">
        <img-cropper :src.sync="form.image" :ratio="NaN"></img-cropper>
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
import { createScreen, updateScreen } from '@/api/splashscreen'
import { formatDate } from '@/utils/index'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      visible: false,
      btnLoading: false,
      form: {
        link: '',
        image: '',
        start_time: formatDate(new Date()),
        end_time: formatDate(new Date()),
        status: 1,
        equipment: 0
      },
      rules: {
        image: [
          { required: true, message: '图片不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改闪屏' : '添加闪屏'
    },
    time: {
      get () {
        return [new Date(this.form.start_time), new Date(this.form.end_time)]
      },
      set (val) {
        this.form.start_time = formatDate(val[0])
        this.form.end_time = formatDate(val[1])
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.data) {
          this.$nextTick().then(() => {
            Object.keys(this.form).forEach(key => {
              this.form[key] = this.data[key]
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
      if (this.id) {
        form.id = this.id
      }
      if (!form.link) {
        delete form.link
      }
      Promise.resolve(
        this.id
          ? updateScreen(form)
          : createScreen(form)
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
