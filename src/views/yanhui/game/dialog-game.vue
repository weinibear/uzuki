<template>
  <el-dialog
    width="700px"
    :visible.sync="visible"
    :title="title">
    <el-form
      :model="form"
      ref="form"
      label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="标题"
            prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item
            label="简介"
            prop="intro">
            <el-input type="textarea" :rows="6" v-model="form.intro"></el-input>
          </el-form-item>
          <el-form-item
            label="分类"
            prop="categories">
            <el-select
              popper-class="v-category-select"
              v-model="form.categories"
              multiple >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="比例">
            <el-select v-model="form.resolution">
              <el-option label="16:9" :value="0"></el-option>
              <el-option label="4:3" :value="1"></el-option>
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
import { mapState, mapActions } from 'vuex'
import { editGame } from '@/api/yanhui/game'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      visible: false,
      btnLoading: false,
      form: {
        title: '',
        intro: '',
        cover: '',
        categories: [],
        resolution: 0
      }
    }
  },
  computed: {
    ...mapState('category', ['categoryList']),
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改章节' : '添加章节'
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
  created () {
    this.getCategoryCache()
  },
  methods: {
    ...mapActions('category', ['getCategoryCache']),
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
      Promise.resolve(
        this.id
          ? editGame(this.id, form)
          : null
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
