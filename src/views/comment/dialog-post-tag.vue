<template>
  <el-dialog width="500px" title="标签" :visible.sync="visible">
    <el-select v-model="tags" multiple>
      <el-option v-for="tag in tagList"
        :key="tag.id"
        :value="tag.id"
        :label="tag.value">
        <img v-if="tag.type === 1" :src="tag.value" style="height: 20px;vertical-align: middle;">
      </el-option>
    </el-select>
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
import { updatePostTag } from '@/api/comment'
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      visible: false,
      btnLoading: false,
      tags: []
    }
  },
  computed: {
    ...mapState('tag', ['tagList'])
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.data) {
          this.$nextTick().then(() => {
            this.tags = this.data.tags.map(v => v.id)
          })
        }
      }
    }
  },
  created () {
    this.getTagCache()
  },
  methods: {
    ...mapActions('tag', ['getTagCache']),
    submit () {
      this.btnLoading = true
      const id = this.data.id
      const tags = this.tags.join()
      updatePostTag(id, tags).finally(() => {
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
