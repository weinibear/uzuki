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
        label="目标ID"
        prop="target">
        <el-input v-model="form.target"></el-input>
      </el-form-item>
      <el-form-item
        label="操作类型"
        prop="operation">
        <el-select v-model="form.operation">
          <el-option v-for="item in operations"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="持续周期"
        prop="cycle">
        <el-input-number v-model="form.cycle" :min="1"></el-input-number>
        <span class="tip">(注:每30分钟为一个周期)</span>
      </el-form-item>
      <el-form-item
        v-show="!needData"
        label="数量"
        prop="amount">
        <el-input-number v-model="form.amount" :min="0"></el-input-number>
      </el-form-item>
      <el-form-item
        v-show="needData"
        label="文本内容"
        prop="data">
        <el-input v-model="form.data"
          type="textarea"
          placeholder="每条用“|”分隔"
          :rows="5"></el-input>
      </el-form-item>
      <el-form-item
        label="状态"
        prop="status">
        <el-switch :active-value="2" :inactive-value="1" v-model="form.status"></el-switch>
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
import { createTask, updateTask } from '@/api/forgeddata'
import { operations } from './options'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      operations,
      visible: false,
      btnLoading: false,
      form: {
        target: '',
        cycle: 1,
        operation: 1,
        amount: 0,
        data: '',
        status: 1
      },
      rules: {
        target: [
          { required: true, message: 'ID不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改数据' : '添加数据'
    },
    needData () {
      return this.form.operation > 2
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
      if (this.needData) {
        form.amount = form.data.trim().split('|').length
      } else {
        delete form.data
      }
      Promise.resolve(
        this.id
          ? updateTask(this.id, form)
          : createTask(form)
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
