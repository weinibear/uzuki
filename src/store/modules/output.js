import { getChannelList } from '@/api/output'

export default {
  namespaced: true,
  state: {
    channelList: [],
    loaded: false
  },
  mutations: {
    setChannelList (state, list) {
      state.loaded = true
      state.channelList = list
    }
  },
  actions: {
    // 刷新缓存
    getChannelList ({ commit, state }) {
      return getChannelList().then(res => {
        commit('setChannelList', res.results)
        return res.results
      })
    },
    getChannelCache ({ dispatch, state }) {
      if (state.loaded) {
        return Promise.resolve(state.channelList)
      }
      return dispatch('getChannelList')
    }
  }
}
