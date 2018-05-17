<template>
  <el-dialog :visible.sync="visible"
    width="500px"

    title="修改用户状态">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="80px">
      <el-form-item label="UID" prop="uid">
        <el-input v-model="form.uid"></el-input>
      </el-form-item>
      <el-form-item label="操作" prop="action">
        <el-select v-model="form.action">
          <el-option v-for="item in userStatus"
            :key="item.value"
            :value="item.value"
            :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原因" prop="description">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-date-picker
          v-model="time"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateUserStatus } from '@/api/user'

export default {
  props: ['uid'],
  data () {
    return {
      visible: false,
      btnLoading: false,
      userStatus: [
        { value: 'ban', label: '封号' },
        { value: 'deban', label: '解封' },
        { value: 'gag', label: '禁言' },
        { value: 'degag', label: '解除禁言' }
      ],
      form: {
        action: 'gag',
        uid: '',
        description: '',
        time: 0
      },
      rules: {
        uid: [
          { required: true, message: 'UID不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    time: {
      get () {
        if (this.form.time) {
          return new Date(this.form.time * 1000)
        }
        return ''
      },
      set (val) {
        this.form.time = new Date(val).getTime() / 1000
      }
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.form.uid = this.uid
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
      updateUserStatus(form).finally(() => {
        this.btnLoading = false
      }).then(() => {
        this.$message.success('萌新瑟瑟发抖')
        this.visible = false
        this.$emit('success')
      })
    }
  }
}
</script>
