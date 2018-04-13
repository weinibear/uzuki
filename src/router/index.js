import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/views/layout'
// import { combineURLs } from '@/utils'

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
      from: '书单管理',
      breadcrumb: [
        { name: '书单管理', to: '/booklist' }
      ]
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
  },
  {
    name: '演绘管理',
    static: true,
    icon: 'github',
    children: [
      {
        path: '/yanhui/material',
        name: '素材管理',
        component: _import('yanhui/material')
      },
      {
        path: '/yanhui/material/type/:type/parent/:parent',
        name: '演绘子素材',
        component: _import('yanhui/material/material-parts'),
        hidden: true,
        meta: {
          from: '演绘素材',
          breadcrumb: [
            { name: '演绘素材', to: { name: '演绘素材' } }
          ]
        }
      },
      {
        path: '/yanhui/tag/:typeid?',
        name: '素材分类',
        component: _import('yanhui/material-category')
      }
    ]
  }
]

let navs = JSON.parse(JSON.stringify(navRoutes))
navs = navs.filter(v => !v.hidden).map(value => {
  if (value.children) {
    value.children = value.children.filter(v => !v.hidden)
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

export { navs }

export default router
