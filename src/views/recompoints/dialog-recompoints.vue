<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    :title="title">
    <el-form
      :model="form"
      ref="form"
      label-width="80px">
      <el-form-item
        label="作品ID"
        prop="works_id"
        :rules="{ required: true, message: 'id不能为空' }">
        <el-input v-model="form.works_id"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status">
          <el-option
            v-for="(label, index) in status"
            :key="index"
            :label="label"
            :value="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="form.area_id">
          <el-option
            v-for="(label, index) in areas"
            :key="index"
            :label="label"
            :value="index"></el-option>
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
import { editRecompoints, addRecompoints } from '@/api/recompoints'
import { status, areas } from './options'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      status,
      areas,
      visible: false,
      btnLoading: false,
      form: {
        area_id: 0,
        works_id: '',
        status: 0
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
      Promise.resolve(
        this.data
          ? editRecompoints(this.id, this.form)
          : addRecompoints(this.form)
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
