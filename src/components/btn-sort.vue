<template>
  <div class="btn-sort">
    <el-button
      v-if="!sortable"
      type="success"
      @click="startSort"
      icon="el-icon-d-caret">开始排序</el-button>
    <template v-else>
      <el-button
        @click="saveSort"
        :loading="btnSortLoading"
        type="primary">更新排序</el-button>
      <el-button
        :disabled="btnSortLoading"
        @click="cancelSort">取消排序</el-button>
    </template>
  </div>
</template>

<script>
export default {
  name: 'BtnSort',
  props: {
    sortable: {
      require: true,
      type: Boolean,
      default: false
    },
    list: Array,
    saveOrder: Function,
    beforeSort: Function
  },
  data () {
    return {
      btnSortLoading: false
    }
  },
  methods: {
    startSort () {
      this.listCache = this.list.slice(0)
      Promise.resolve(
        typeof this.beforeSort === 'function'
          ? this.beforeSort()
          : true
      ).then(() => {
        this.$emit('update:sortable', true)
      })
    },
    cancelSort () {
      this.$emit('update:list', this.listCache)
      this.$emit('update:sortable', false)
      this.listCache = []
    },
    saveSort () {
      let min = Math.min.apply(null, this.list.map(v => v.order))
      if (min < 0) {
        min = 0
      }
      this.btnSortLoading = true
      const rp = this.list.map((v, i) => {
        return {
          id: v.id,
          oldOrder: v.order,
          order: i + min
        }
      }).filter(v => v.oldOrder !== v.order)
        .map(this.saveOrder)
      Promise.all(rp)
        .finally(() => {
          this.btnSortLoading = false
        })
        .then(() => {
          this.$message.success('更新成功')
          this.$emit('update:sortable', false)
          this.$emit('success')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-sort {
  display: inline-block;
  margin-left: 10px;
  &:first-child {
    margin-left: 0;
  }
}
</style>
