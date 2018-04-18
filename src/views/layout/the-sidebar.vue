<template>
  <nav class="sidebar">
    <a class="home" href="/">
      <span class="logo" v-show="!isCollapse"> </span>
      <svg-icon icon="home"></svg-icon>
    </a>
    <el-menu
      :collapse="isCollapse"
      :default-active="actived"
      router>
      <template v-for="item in navs">
        <el-submenu
          v-if="item.static && item.children.length"
          :index="item.path || item.name"
          :key="item.path">
          <template slot="title">
            <svg-icon
              v-if="item.icon"
              :icon="item.icon" />
            <span slot="title">{{item.name}}</span>
          </template>
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path">
            <svg-icon
              v-if="child.icon"
              :icon="child.icon" />
            <span slot="title">{{child.name}}</span>
          </el-menu-item>
        </el-submenu>
        <el-menu-item
          v-else
          :index="item.path"
          :key="item.path">
          <svg-icon
            v-if="item.icon"
            :icon="item.icon" />
          <span slot="title">{{item.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </nav>
</template>

<script>
import difference from 'lodash/difference'
import { navs } from '@/router'

export default {
  data () {
    return {
      navs
    }
  },
  computed: {
    actived () {
      const urlPart = this.$route.path.split('/')
      let maxDifference = 999
      let path = ''
      this.navs.forEach(item => {
        if (item.children) {
          item.children.forEach(subItem => {
            const d = difference(urlPart, subItem.path.split('/')).length
            if (d < maxDifference) {
              path = subItem.path
              maxDifference = d
            }
          })
        } else {
          const d = difference(urlPart, item.path.split('/')).length
          if (d < maxDifference) {
            path = item.path
            maxDifference = d
          }
        }
      })
      return path
    },
    isCollapse () {
      return this.$store.state.app.sidebarFolded
    }
  }
}
</script>

<style lang="scss">
@import '~@/style/var.scss';
.sidebar {
  background-color: #323d57;
  .home {
    display: block;
    height: 56px;
    line-height: 56px;
    padding: 0 20px;
    color: #bfc8d9;
    &:hover {
      background-color: #48546a;
      .logo {
        animation: logo steps(1) 2s infinite;
      }
    }
  }
  .logo {
    display:inline-block;
    height: 32px;
    width: 100%;
    margin-top: 12px;
    background: url('~@/assets/logo-v2.png') no-repeat 0 0 content-box
      border-box;
  }
  .el-submenu {
    .el-menu {
      background-color: #1f2a3d;
    }
  }
  .el-menu {
    background-color: #323d57;
    border-right: 0;
  }
  .el-menu:not(.el-menu--collapse) {
    width: 230px;
  }
  .el-menu-item,
  .el-submenu__title {
    color: #bfc8d9;
    &:hover,
    &:focus {
      background-color: #48546a;
    }
  }
  .el-menu-item.is-active {
    color: #74b7ff;
  }
  .svg-icon {
    margin-right: 8px;
    vertical-align: -0.2em;
  }
}
@keyframes logo {
  0% {
    background-position-y: 0;
  }
  5% {
    background-position-y: -32px;
  }
  10% {
    background-position-y: -64px;
  }
  15% {
    background-position-y: -32px;
  }
  20% {
    background-position-y: 0;
  }
  25% {
    background-position-y: -32px;
  }
  30% {
    background-position-y: -64px;
  }
  35% {
    background-position-y: -32px;
  }
  40% {
    background-position-y: 0;
  }
  45% {
    background-position-y: 0;
  }
  50% {
    background-position-y: 0;
  }
  55% {
    background-position-y: 0;
  }
  60% {
    background-position-y: 0;
  }
  65% {
    background-position-y: 0;
  }
  70% {
    background-position-y: -96px;
  }
  75% {
    background-position-y: -96px;
  }
  80% {
    background-position-y: -96px;
  }
  85% {
    background-position-y: -96px;
  }
  90% {
    background-position-y: 0;
  }
  95% {
    background-position-y: 0;
  }
  100% {
    background-position-y: 0;
  }
}
</style>
