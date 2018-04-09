<template>
  <el-dialog :visible.sync="visible"
    width="500px"
    title="书单批量添加作品">
    <el-form :model="form" ref="form" label-width="60px">
      <el-form-item label="书籍">
        <el-input type="textarea" :rows="2" v-model="form.book" placeholder="请输入书籍ID,用逗号隔开"></el-input>
      </el-form-item>
      <el-form-item label="演绘">
        <el-input type="textarea" :rows="2" v-model="form.game" placeholder="请输入演绘ID,用逗号隔开"></el-input>
      </el-form-item>
      <el-form-item label="推荐词">
        <el-input type="textarea" :rows="2" v-model="form.recommend"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="save" :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addWorks } from '@/api/booklist'

export default {
  data () {
    return {
      visible: false,
      btnLoading: false,
      form: {
        book: '',
        game: '',
        recommend: ''
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
      this.btnLoading = true
      const recommend = this.form.recommend
      const id = this.$route.params.id
      let book = this.form.book.trim()
      let game = this.form.game.trim()
      if (!book && !game) {
        return this.$message.warn('至少需要一个作品ID')
      }
      book = book.split(/[,，]/).map(v => +v).filter(v => v)
      game = game.split(/[,，]/).map(v => +v).filter(v => v)
      addWorks(id, { book, game, recommend }).finally(() => {
        this.btnLoading = false
      }).then(() => {
        this.visible = false
        this.$emit('success')
      })
    }
  }
}
</script>
