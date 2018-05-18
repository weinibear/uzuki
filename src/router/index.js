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
import othersRoute from './routes/others'
import commentRoute from './routes/comment'
import booklistRoute from './routes/booklist'

import hook from './hook'

Vue.use(Router)

const navRoutes = [
  userRoute,
  walletRoute,
  recommendRoute,
  ...booklistRoute,
  {
    path: '/category',
    name: '分类管理',
    icon: 'category',
    component: () => import(/* webpackChunkName: "page-category" */'@/views/category/index')
  },
  {
    path: '/blockword',
    name: '屏蔽词管理',
    icon: 'ban',
    component: () => import(/* webpackChunkName: "page-blockword" */'@/views/blockword/index')
  },
  bookRoute,
  outputRoute,
  yanhuiRoute,
  commentRoute,
  othersRoute,
  statsRoute
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
