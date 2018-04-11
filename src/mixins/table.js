
export default {
  data () {
    return {
      loading: false,
      list: [],
      total: 0,
      limit: 10
    }
  },
  computed: {
    offset () {
      const page = +this.$route.query.page || 1
      return (page - 1) * this.limit
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler: 'getList'
    }
  },
  methods: {
    getList (...args) {
      this.loading = true
      const params = {
        offset: this.offset,
        limit: this.limit
      }
      if (typeof this.getData === 'function') {
        return this.getData(params, ...args).finally(() => {
          this.loading = false
        })
      }
      console.warn('minix table需要this.gataData方法', this)
      return Promise.resolve()
    },
    del (data) {
      if (typeof this.delData !== 'function') {
        console.warn('minix table需要this.delData方法', this)
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
              this.getList()
            })
          } else {
            done()
          }
        }
      })
    }
  }
}
