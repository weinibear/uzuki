// Promise
import './utils/promise'
// style
import 'normalize.css'
import 'element-ui/lib/theme-chalk/reset.css'
import '@/style/index.scss'

import Vue from 'vue'

import router from './router'
import store from './store'

import * as filters from './filter'
import Element from './element-ui'

import './icons'

Vue.use(Element, { size: 'small' })

function importComponents (r) {
  r.keys().forEach(path => {
    const value = r(path).default
    const key = value.name || path.replace(/^.*\/|\.(js|vue)$/g, '')
    Vue.component(key, value)
  })
}

importComponents(require.context('./components', true, /\.(js|vue)$/))

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => (
    <div id="app">
      <router-view />
    </div>
  )
})
