// Promise
import './utils/promise'
// style
import 'normalize.css'
import '@/style/index.scss'

import Vue from 'vue'
import './element-ui'

import router from './router'
import store from './store'

import DatePicker from 'vue2-datepicker'

import './icons'

Vue.config.productionTip = true
Vue.config.devtools = true

Vue.use(DatePicker)

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
