<template>
  <el-dialog :visible.sync="visible"
    width="500px"
    title="添加消息">
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
      <el-form-item label="发送者" prop="sender">
        <el-select v-model="form.sender">
          <el-option v-for="option in senders"
            :key="option.value"
            :label="option.label"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="type">
          <el-option v-for="option in messageTypes"
            :key="option.value"
            :label="option.label"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接受者ID" prop="receiver" v-show="type === 'message'">
        <el-input v-model="form.receiver"></el-input>
      </el-form-item>
      <el-form-item label="是否推送" prop="push">
        <el-switch v-model="form.push"
          :active-value="1"
          :inactive-value="undefined"></el-switch>
      </el-form-item>
      <el-form-item label="消息链接" prop="links">
        <el-input v-model="form.links"></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="content">
        <el-input v-model="form.content" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createMessage } from '@/api/message'
import { messageTypes, senders } from './options'

export default {
  data () {
    return {
      messageTypes,
      senders,
      visible: false,
      btnLoading: false,
      type: messageTypes[1].value,
      form: {
        sender: senders[0].value,
        receiver: '',
        push: undefined,
        links: '',
        content: ''
      },
      rules: {
        receiver: [
          {
            validator: (rule, value, callback) => {
              if (this.type === 'message' && value === '') {
                callback(new Error('接受者不能为空'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        content: [{ required: true, trigger: 'blur' }]
      }
    }
  },
  watch: {
    visible (val) {
      if (!val) {
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
      if (this.type === 'admin_message') {
        form.receiver = 'all'
      }
      createMessage(form).finally(() => {
        this.btnLoading = false
      }).then(() => {
        this.visible = false
        this.$emit('success')
      })
    }
  }
}
</script>
