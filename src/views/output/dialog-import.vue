<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"

    title="导入作品">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="80px">
      <el-form-item
        label="渠道"
        prop="channel">
        <el-select
          v-model="form.channel">
          <el-option
            v-for="option in channelList"
            :key="option.id"
            :value="option.id"
            :label="option.name">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="type === 'online'"
        label="作品ID"
        prop="content">
        <el-input v-model="form.content"
          placeholder='输入书籍ID,多部作品请用 "," 隔开'></el-input>
      </el-form-item>
      <el-form-item
        v-else
        label="选择文件"
        prop="content">
        <input type="file"
          accept=".txt"
          ref="inputFile"
          @change="changeFile">
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
import { mapState } from 'vuex'
import { importNewBook } from '@/api/output'

export default {
  props: {
    channel: ''
  },
  data () {
    const rules = {
      channel: [{ required: true, message: '请选择渠道', trigger: 'blur' }],
      content: [{ required: true, message: '请选择', trigger: 'blur' }]
    }
    return {
      type: 'online',
      visible: false,
      btnLoading: false,
      form: {
        channel: '',
        content: ''
      },
      rules
    }
  },
  computed: {
    ...mapState('output', ['channelList'])
  },
  watch: {
    visible (val) {
      if (!val) {
        this.$refs.form.resetFields()
        if (this.$refs.inputFile) {
          this.$refs.inputFile.value = ''
        }
      } else {
        this.form.channel = this.channel
      }
    }
  },
  methods: {
    changeFile (e) {
      console.log(e.target.files)
      const files = e.target.files
      if (files && files.length) {
        this.form.content = files[0]
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
      const channelId = this.form.channel
      const fd = new window.FormData()
      if (this.type === 'online') {
        fd.append('book_id', this.form.content)
      } else {
        fd.append('file', this.form.content)
      }
      importNewBook(channelId, fd).finally(() => {
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
