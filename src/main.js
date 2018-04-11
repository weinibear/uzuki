// Promise
import './utils/promise'
// style
import 'normalize.css/normalize.css'
import '@/style/index.scss'

import Vue from 'vue'

import router from './router'
import store from './store'

import './icons'

import * as filters from './filter'
import Element from 'element-ui'

import SvgIcon from '@/components/svg-icon'
import BaseTable from '@/components/base-table'
import BaseSwitch from '@/components/base-switch/index.js'
import ImgCropper from '@/components/img-cropper'
import BtnSort from '@/components/btn-sort'
import UploadPreview from '@/components/upload-preview'

Vue.use(Element, { size: 'small' })

const components = [SvgIcon, BaseTable, ImgCropper, BaseSwitch, BtnSort, UploadPreview]

components.forEach(component => {
  Vue.component(component.name, component)
})

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
