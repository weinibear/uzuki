
export default {
  methods: {
    del (data, title = '确认删除么?') {
      if (typeof this.delData !== 'function') {
        console.warn('minix del需要this.delData方法', this)
        return
      }
      this.$confirm(title, '提示', {
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return this.delData(data).finally(() => {
              instance.confirmButtonLoading = false
            }).then(() => {
              done()
              this.$message.success('success')
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
