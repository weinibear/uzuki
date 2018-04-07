<template>
  <el-breadcrumb
    class="app-breadcrumb"
    separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumb"
        :key="item.name">
        <span v-if='index === breadcrumb.length - 1'>{{item.name}}</span>
        <router-link
          class="app-breadcrumb-link"
          v-else
          :to="item.to">{{item.name}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState('app', ['breadcrumb', 'breadcrumbCustom'])
  },
  methods: {
    ...mapMutations('app', ['setBreadcrumb', 'changeBreadcrumbCustom'])
  },
  watch: {
    '$route': {
      immediate: true,
      handler (to, from) {
        if (from && from.path === to.path) {
          return
        }
        this.$nextTick().then(() => {
          if (!this.breadcrumbCustom) {
            const levelList = to.matched
              .filter(item => (item.meta && item.meta.title) || item.name)
              .map(item => ({ to: item.path, name: (item.meta && item.meta.title) || item.name }))
            this.setBreadcrumb(levelList)
          }
          this.changeBreadcrumbCustom(false)
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import '~@/style/var.scss';
.app-breadcrumb {
  display: inline-block;
  font-size: 14px;
  .app-breadcrumb-link {
    color: $--color-primary;
    font-weight: normal;
    &:hover {
      color: mix(#fff, $--color-primary, 20%);
    }
  }
}
.el-breadcrumb__item {
  transition: all 0.3s;
}
.breadcrumb-enter, .breadcrumb-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
