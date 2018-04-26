// Promise
import './utils/promise'
// style
import 'normalize.css'
import '@/style/index.scss'

import Vue from 'vue'

import router from './router'
import store from './store'

import * as filters from './filter'
import Element from './element-ui'
import localStore from './utils/localStore'

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
const app = new Vue({
  el: '#app',
  router,
  store,
  render: h => (
    <div id="app">
      <router-view />
    </div>
  )
})

const KEY = 'i_knowed_risk'
if (localStore.get(KEY) !== 1) {
  app.$notify({
    title: '警告',
    message: '这是正在重构的后台,有些功能还没有经过严格测试,修改数据有风险',
    duration: 0,
    type: 'warning',
    onClose: () => {
      localStore.set(KEY, 1)
    }
  })
}
