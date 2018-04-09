import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/layout'
// import { combineURLs } from '@/utils'

Vue.use(Router)

const _import = function (file) {
  return function () {
    return import('@/views/' + file)
  }
}

const navRoutes = [
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
      from: '书单管理'
    },
    component: _import('booklist/work-list')
  },
  {
    name: '推荐管理',
    icon: 'star',
    static: true,
    children: [
      {
        path: '/recommend',
        name: '综合推荐',
        component: _import('recommend/index')
      },
      {
        path: '/recompoints',
        name: '信仰榜推荐',
        component: _import('recompoints/index')
      }
    ]
  },
  {
    path: '/category',
    name: '分类管理',
    icon: 'category',
    component: _import('category/index')
  }
]

const navs = navRoutes.filter(route => !route.hidden)

const routes = [
  {
    path: '/',
    component: Layout,
    children: navRoutes.reduce((prev, curr) => {
      return prev.concat(curr.static ? curr.children : curr)
    }, [])
  },
  { path: '*', redirect: '/recompoints', hidden: true }
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

export { navs }

export default router
