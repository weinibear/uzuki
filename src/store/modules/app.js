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
    // 设置面包屑
    setBreadcrumb (state, list) {
      state.breadcrumb = list
      state.breadcrumbCustom = true
    },
    // 默认面包屑 layout/the-breadcrumb:watch
    changeBreadcrumbCustom (state, custom = false) {
      state.breadcrumbCustom = custom
    }
  }
}
