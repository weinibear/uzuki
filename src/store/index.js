import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const modules = {}

const importAll = function (r) {
  r.keys().forEach(path => {
    const key = path.replace(/^.*\/(\w+)\.js$/, '$1')
    modules[key] = r(path).default
  })
}

importAll(require.context('./modules/', false, /\.js$/))

const store = new Vuex.Store({
  modules,
  strict: debug
})

export default store
