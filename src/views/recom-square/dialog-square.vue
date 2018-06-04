<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    :title="title">
    <el-form
      :model="form"
      ref="form"
      label-width="60px">
      <el-form-item
        label="状态"
        prop="enabled">
        <el-select v-model="form.enabled">
          <el-option label="启用" :value="true"></el-option>
          <el-option label="禁用" :value="false"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="form.location">
          <el-option
            v-for="(option, index) in location"
            :key="index"
            :label="option.label"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分区">
        <el-select v-model="form.locate">
          <el-option
            v-for="(option, index) in locate"
            :key="index"
            :label="option.label"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="标题"
        prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item
        label="时间">
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
        label="链接"
        prop="main_url">
        <el-input v-model="form.main_url"></el-input>
      </el-form-item>
      <el-form-item
        label="封面"
        prop="cover">
        <img-cropper
          :src.sync="form.cover"
          :height="100"
          :ratio="34/10"></img-cropper>
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
import { updateRecomSquare, createdRecomSquare } from '@/api/recom-square'
import { location, locate } from './options'
import { formatDate } from '@/utils/index'

export default {
  props: {
    data: Object
  },
  data () {
    const now = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss.S')
    return {
      locate,
      location,
      visible: false,
      btnLoading: false,
      form: {
        enabled: false,
        location: 0,
        locate: 1,
        title: '',
        started_time: now,
        ended_time: now,
        main_url: '',
        cover: ''
      }
    }
  },
  computed: {
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改推荐' : '添加推荐'
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
          this.form.started_time = formatDate(val[0], 'yyyy-MM-ddTHH:mm:ss.S')
          this.form.ended_time = formatDate(val[1], 'yyyy-MM-ddTHH:mm:ss.S')
        } else {
          this.form.started_time = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss.S')
          this.form.ended_time = formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss.S')
        }
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
      const form = {...this.form}
      Promise.resolve(
        this.id
          ? updateRecomSquare(this.id, form)
          : createdRecomSquare(form)
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
