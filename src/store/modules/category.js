import { getCategoryList } from '@/api/category'

export default {
  namespaced: true,
  state: {
    categoryList: [],
    loaded: false
  },
  mutations: {
    setCategoryList (state, list) {
      state.loaded = true
      state.categoryList = list
    }
  },
  actions: {
    getCategoryList ({ commit, state }) {
      return getCategoryList({ offset: 0, limit: 999 }).then(res => {
        commit('setCategoryList', res.results)
        return res.results
      })
    },
    getCategoryCache ({ dispatch, state }) {
      if (state.loaded) {
        return Promise.resolve(state.categoryList)
      }
      return dispatch('getCategoryList')
    }
  }
}
