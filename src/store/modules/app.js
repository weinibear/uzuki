import localStore from '@/utils/localStore'

export default {
  namespaced: true,
  state: {
    sidebarFolded: !!localStore.get('sidebarFolded'),
    breadcrumb: [],
    breadcrumbLoaded: false
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
      state.breadcrumbLoaded = true
    },
    pushBreadcrumb (state, obj) {
      state.breadcrumb.push(obj)
      state.breadcrumbLoaded = true
    },
    popBreadcrumb (state, obj) {
      state.breadcrumb.pop()
      state.breadcrumbLoaded = true
    },
    // 默认面包屑 layout/the-breadcrumb:watch
    changebreadcrumbStatus (state, loaded = false) {
      state.breadcrumbLoaded = loaded
    }
  }
}
