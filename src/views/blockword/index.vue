<template>
  <div>
    <el-tag
      class="tag"
      :key="tag"
      v-for="(tag, index) in tags"
      size="default"
      type="danger"
      closable
      @close="del(index)">
      {{tag}}
    </el-tag>
    <el-button icon="el-icon-plus" type="primary" @click="add">添加</el-button>
  </div>
</template>

<script>
import { getBlockwords, createBlockword, delBlockword } from '@/api/blockword'
import { confirm } from '@/utils/confirm'

export default {
  data () {
    return {
      loading: false,
      tags: []
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.loading = true
      getBlockwords().then(res => {
        this.tags = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    add () {
      this.$prompt('请输入关键词', {
        inputValidator: (val) => {
          if (!val || val.trim() === '') {
            return '关键词不能为空...'
          }
          return true
        },
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = 'loading...'
            const word = instance.inputValue.trim()
            createBlockword(word).then(() => {
              this.getList()
              this.tags.push(word)
              done()
            }).finally(() => {
              instance.confirmButtonLoading = false
              instance.confirmButtonText = '确定'
            })
          } else {
            done()
          }
        }
      })
    },
    del (index) {
      confirm(this.delData.bind(this, index))
    },
    delData (index) {
      const data = this.tags[index]
      return delBlockword(data).then(() => {
        this.$message.success('success')
        this.tags.splice(index, 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tag {
  margin: 5px;
}
</style>
