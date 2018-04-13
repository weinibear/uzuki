import localStore from '@/utils/localStore'

export default {
  namespaced: true,
  state: {
    sidebarFolded: !!localStore.get('sidebarFolded'),
    breadcrumb: [],
    breadcrumbCustom: false
  },
  mutations: {
    toggleSidebar (state) {
      state.sidebarFolded = !state.sidebarFolded
      localStore.set('sidebarFolded', state.sidebarFolded)
    },
    setCurrentPath (state, path) {
      const len = state.breadcrumb.length
      if (len) {
        state.breadcrumb[len - 1].to = path
      }
    },
    // 设置面包屑
    setBreadcrumb (state, list) {
      state.breadcrumb = list
      state.breadcrumbCustom = true
    },
    pushBreadcrumb (state, obj) {
      state.breadcrumb.push(obj)
      state.breadcrumbCustom = true
    },
    popBreadcrumb (state, obj) {
      state.breadcrumb.pop()
      state.breadcrumbCustom = true
    },
    // 默认面包屑 layout/the-breadcrumb:watch
    changeBreadcrumbCustom (state, custom = false) {
      state.breadcrumbCustom = custom
    }
  }
}
