// Promise
import './utils/promise'

import Vue from 'vue'

import router from './router'
import store from './store'

import * as filters from './filter'
import Element from 'element-ui'

// style
import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/reset.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/style/index.scss'

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
