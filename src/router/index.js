import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/layout'
import { combineURLs } from '@/utils'

Vue.use(Router)

const _import = function (file) {
  return function () {
    return import('@/views/' + file)
  }
}

// function generateRoute (path, component, name, icon, children, meta = {}) {
//   const results = {}
//   results.path = path
//   results.component = (typeof component === 'string') ? _import(component) : component
//   if (name) results.name = name
//   if (icon) results.icon = icon
//   if (Array.isArray(children)) {
//     results.children = children
//   }
//   results.meta = meta
//   return results
// }

const routes = [
  {
    path: '/recompoints',
    component: Layout,
    meta: {
      icon: 'firefox',
      title: '信仰榜推荐'
    },
    children: [
      {
        path: '',
        component: _import('recompoints/index')
      }
    ]
  },
  {
    path: '/recommend',
    component: Layout,
    meta: {
      icon: 'star',
      title: '推荐管理'
    },
    children: [
      {
        path: '',
        name: '推荐管理',
        component: _import('recommend/index')
      }
    ]
  },
  {
    path: '/booklist',
    component: Layout,
    meta: {
      icon: 'star',
      title: '书单管理'
    },
    children: [
      {
        path: '',
        component: _import('booklist/index')
      }, {
        path: ':id',
        name: '书单作品',
        hidden: true,
        component: _import('booklist/work-list')
      }
    ]
  },
  {
    path: '/book',
    component: Layout,
    meta: {
      icon: 'chrome',
      title: '书籍管理'
    },
    children: [
      {
        path: 'reviews',
        name: '作品审核',
        component: _import('book/book-manage')
      }
    ]
  },
  { path: '*', redirect: '/recompoints', hidden: true }
]

const navRoutes = []

routes.filter(route => {
  return !route.hidden
}).forEach(route => {
  if (route.children) {
    const children = route.children.filter(child => !child.hidden)
    if (children.length === 1 && children[0].path === '') {
      navRoutes.push({
        path: route.path,
        name: route.meta && route.meta.title,
        icon: route.meta && route.meta.icon
      })
    } else {
      navRoutes.push({
        path: route.path,
        name: route.meta && route.meta.title,
        icon: route.meta && route.meta.icon,
        children: children.map(v => {
          return {
            name: (v.meta && v.meta.title) || v.name,
            path: /^\//.test(v.path) ? v.path : combineURLs(route.path, v.path)
          }
        })
      })
    }
  }
})

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

export { navRoutes }

export default router
