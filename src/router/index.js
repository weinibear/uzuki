import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/layout'
import outputRoute from './routes/output'
import yanhuiRoute from './routes/yanhui'

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
      },
      {
        path: '/activity',
        name: '活动列表',
        component: _import('activity/index')
      },
      {
        path: '/activity/:id',
        name: '活动详情',
        hidden: true,
        meta: {
          breadcrumb: { name: '活动列表', to: '/activity' }
        },
        component: _import('activity/form-activity')
      }
    ]
  },
  {
    path: '/category',
    name: '分类管理',
    icon: 'category',
    component: _import('category/index')
  },
  ...outputRoute(_import),
  ...yanhuiRoute(_import)

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
    redirect: '/recompoints',
    children: navRoutes.reduce((prev, curr) => {
      return prev.concat(curr.static ? curr.children : curr)
    }, [])
  },
  {
    path: '/uitest',
    component: _import('ui-test/index')
  },
  { path: '*', redirect: '/recompoints' }
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
