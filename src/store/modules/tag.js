import { getTagList } from '@/api/comment'

export default {
  namespaced: true,
  state: {
    tagList: [],
    loaded: false
  },
  mutations: {
    setTagList (state, list) {
      state.loaded = true
      state.tagList = list
    }
  },
  actions: {
    // 刷新缓存
    getTagList ({ commit, state }) {
      return getTagList({ offset: 0, limit: 999 }).then(res => {
        commit('setTagList', res.results)
        return res.results
      })
    },
    getTagCache ({ dispatch, state }) {
      if (state.loaded) {
        return Promise.resolve(state.tagList)
      }
      return dispatch('getTagList')
    }
  }
}
