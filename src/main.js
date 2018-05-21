// Promise
import './utils/promise'
// style
import 'normalize.css'
import '@/style/index.scss'

import Vue from 'vue'
import './element-ui'

import router from './router'
import store from './store'

import './icons'
import showUpgradeInfo from './upgrade'

Vue.config.devtools = true
Vue.config.productionTip = false
Vue.prototype.$ELEMENT = {
  size: 'small'
}

function importComponents (r) {
  r.keys().forEach(path => {
    const value = r(path).default
    const key = value.name || path.replace(/^.*\/|\.(js|vue)$/g, '')
    Vue.component(key, value)
  })
}

importComponents(require.context('./components', true, /\.(js|vue)$/))

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

showUpgradeInfo()
