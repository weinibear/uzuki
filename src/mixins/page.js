
export default {
  data () {
    return {
      limit: 10
    }
  },
  computed: {
    offset () {
      const page = +this.$route.query.page || 1
      return (page - 1) * this.limit
    }
  }
}
