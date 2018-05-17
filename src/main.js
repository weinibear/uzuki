// Promise
import './utils/promise'
// style
import 'normalize.css'
import '@/style/index.scss'

import Vue from 'vue'
import './element-ui'

import router from './router'
import store from './store'

import localStore from './utils/localStore'
import DatePicker from 'vue2-datepicker'

import './icons'

Vue.use(DatePicker)

function importComponents (r) {
  r.keys().forEach(path => {
    const value = r(path).default
    const key = value.name || path.replace(/^.*\/|\.(js|vue)$/g, '')
    Vue.component(key, value)
  })
}

importComponents(require.context('./components', true, /\.(js|vue)$/))

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
if (localStore.get(KEY) !== 2) {
  const notify = app.$notify({
    title: '一些废话',
    message: (function (h) {
      return (
        <div>
          <p>这是正在重构的后台，有些功能还不完善，如无必要请使用
            <a href="/new.html">旧后台</a>，使用中有问题可以向前端-谢孟雄反馈。</p>
          <el-button
            size="mini"
            type="primary"
            style="float:right"
            onClick={
              () => {
                notify.close()
                localStore.set(KEY, 2)
              }
            }>知道了</el-button>
        </div>
      )
    })(app.$createElement),
    duration: 0,
    showClose: false,
    type: 'warning'
  })
}
