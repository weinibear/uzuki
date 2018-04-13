<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    title="添加素材分类">
    <el-form
      :model="form"
      ref="form"
      label-width="80px">
      <el-form-item
        label="级别"
        prop="groupid">
        <el-select v-model="form.groupid">
          <el-option
            v-for="(item, index) in ['一级标签', '二级标签', '三级标签']"
            :key="index"
            :value="index + 1"
            :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="类型"
        prop="usetype">
        <el-select v-model="form.usetype">
          <el-option
            v-for="(item, key) in useTypes"
            :key="key"
            :value="item.category"
            :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="名称"
        prop="name"
        :rules="{ required: true, message: '名字不能为空' }">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item
        label="父标签ID"
        prop="typeid">
        <el-input v-model.number="form.typeid"></el-input>
      </el-form-item>
      <el-form-item
        label="序号"
        prop="order">
        <el-input v-model.number="form.order"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="save" :loading="btnLoading">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addTag, modifyTag } from '@/api/yanhui/tag'
import { useTypes } from '../options'

export default {
  props: ['data'],
  data () {
    return {
      useTypes,
      visible: false,
      btnLoading: false,
      form: {
        groupid: 1,
        usetype: 0,
        name: '',
        order: 0,
        typeid: 0
      }
    }
  },
  computed: {
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改素材分类' : '添加素材分类'
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
      const form = this.forms
      Promise.resolve(
        this.id
          ? modifyTag(this.id, form)
          : addTag(form)
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
