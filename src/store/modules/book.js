import { getSourceList } from '@/api/book'

export default {
  namespaced: true,
  state: {
    sourceList: [],
    loaded: false
  },
  mutations: {
    setSourceList (state, list) {
      state.loaded = true
      state.sourceList = list
    }
  },
  actions: {
    getSourceList ({ commit, state }) {
      return getSourceList().then(res => {
        commit('setSourceList', res.results)
        return res.results
      })
    },
    getSourceCache ({ dispatch, state }) {
      if (state.loaded) {
        return Promise.resolve(state.sourceList)
      }
      return dispatch('getSourceList')
    }
  }
}
