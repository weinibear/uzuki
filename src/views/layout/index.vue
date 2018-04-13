<template>
  <div class="app-wrapper">
    <the-sidebar />
    <section class="app-container">
      <header class="app-header">
        <div
          class="hamburger"
          :class="{'is-collapse': isCollapse}"
          @click="toggleSidebar">
          <svg-icon icon="bars" />
        </div>
        <the-breadcrumb />
      </header>
      <div class="app-main-wrapper">
        <router-view class="app-main" />
      </div>
    </section>
  </div>
</template>

<script>
import TheSidebar from './the-sidebar'
import TheBreadcrumb from './the-breadcrumb'
import { mapMutations } from 'vuex'

export default {
  components: { TheSidebar, TheBreadcrumb },
  name: 'Layout',
  computed: {
    isCollapse () {
      return this.$store.state.app.sidebarFolded
    }
  },
  methods: {
    ...mapMutations('app', ['toggleSidebar'])
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.app-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.app-header {
  height: 50px;
  line-height: 50px;
  padding:0 20px;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
.hamburger {
  display: inline-block;
  font-size: 20px;
  margin-right: 10px;
  cursor: pointer;
  color: #666;
  transition: transform 0.3s;
  &:hover {
    color: #333;
  }
  &.is-collapse {
    transform: rotate(90deg);
  }
}
.app-main-wrapper {
  flex: 1;
  overflow: auto;
  padding: 20px;
  color: #606266;
  // min-width: 1000px;
}
.app-main {
  min-width: 1000px;
}
.menu-right {
  float: right;
}
</style>
