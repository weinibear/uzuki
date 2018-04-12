
export default {
  methods: {
    del (data) {
      if (typeof this.delData !== 'function') {
        console.warn('minix del需要this.delData方法', this)
        return
      }
      this.$confirm('确认删除么?', {
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return this.delData(data).finally(() => {
              instance.confirmButtonLoading = false
            }).then(() => {
              done()
              this.$message.success('删除成功')
              this.$emit('refresh')
            })
          } else {
            done()
          }
        }
      })
    }
  }
}
