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
          @click.native="link(index)"
          v-else
          :to="item.to">{{item.name}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'

export default {
  computed: {
    ...mapState('app', ['breadcrumb', 'breadcrumbCustom'])
  },
  methods: {
    ...mapMutations('app', ['setBreadcrumb', 'changeBreadcrumbCustom', 'setCurrentPath']),
    link (index) {
      const breadcrumb = this.breadcrumb.slice(0, index + 1)
      this.setBreadcrumb(breadcrumb)
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler (to, from) {
        this.setCurrentPath(to.fullPath)
        if (from && from.path === to.path) {
          return
        }
        this.$nextTick().then(() => {
          if (!this.breadcrumbCustom) {
            let levelList = []
            if (to.meta.breadcrumb) {
              if (typeof to.meta.breadcrumb === 'function') {
                levelList = [].concat(to.meta.breadcrumb(to))
              } else {
                levelList = [].concat(_cloneDeep(to.meta.breadcrumb))
              }
            }
            levelList.push({ to: to.fullPath, name: to.meta.title || to.name })
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
