import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/layout'
import outputRoute from './routes/output'
import yanhuiRoute from './routes/yanhui'
import recommendRoute from './routes/recommend'
import userRoute from './routes/user'
import walletRoute from './routes/wallet'
import bookRoute from './routes/book'
import statsRoute from './routes/stats'

import hook from './hook'

Vue.use(Router)

// const importAsync = function (file) {
//   return function () {
//     return import('@/views/' + file)
//   }
// }

const importSync = function (file) {
  return require('@/views/' + file).default
}

const _import = importSync

const navRoutes = [
  userRoute(_import),
  walletRoute(_import),
  recommendRoute(_import),
  {
    path: '/booklist',
    name: '书单管理',
    icon: 'booklist',
    component: _import('booklist/index')
  },
  {
    path: '/booklist/:id',
    name: '书单作品',
    hidden: true,
    meta: {
      breadcrumb: { name: '书单管理', to: '/booklist' }
    },
    component: _import('booklist/work-list')
  },
  {
    path: '/category',
    name: '分类管理',
    icon: 'category',
    component: _import('category/index')
  },
  {
    path: '/blockword',
    name: '屏蔽词管理',
    icon: 'ban',
    component: _import('blockword/index')
  },
  bookRoute(_import),
  outputRoute(_import),
  yanhuiRoute(_import),
  statsRoute(_import)
]

const handlePath = function (nav) {
  if (nav.path) {
    nav.path = nav.path.replace(/\/:[^/]+/g, '')
  }
  return nav
}

let navs = JSON.parse(JSON.stringify(navRoutes))
navs = navs.filter(v => !v.hidden).map(handlePath).map(value => {
  if (value.children) {
    value.children = value.children.filter(v => !v.hidden).map(handlePath)
  }
  return value
})

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/recommend',
    children: navRoutes.reduce((prev, curr) => {
      return prev.concat(curr.static ? curr.children : curr)
    }, [])
  },
  { path: '*', redirect: '/recommend' }
]

const router = new Router({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

hook(router)

export { navs }

export default router
