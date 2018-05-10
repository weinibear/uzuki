<template>
  <el-dialog
    width="500px"
    :visible.sync="visible"
    title="批量修改">
    <el-form
      :model="form"
      ref="form"
      label-width="80px">
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type">
          <el-option v-for="item in chapterType"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="submit"
        :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { updateChapter } from '@/api/book'
import { chapterType } from './options'

export default {
  props: {
    data: Array
  },
  data () {
    return {
      chapterType,
      visible: false,
      btnLoading: false,
      form: {
        type: 1
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
    submit () {
      this.btnLoading = true
      const type = this.form.type
      const items = this.data.filter(v => (v.type !== type))
      Promise.all(
        items.map(v => updateChapter(v.id, { type }))
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
