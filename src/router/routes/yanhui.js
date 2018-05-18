export default {
  name: '演绘管理',
  static: true,
  icon: 'github',
  children: [
    {
      path: '/yanhui/list',
      name: '演绘列表',
      component: () => import(/* webpackChunkName: "page-yanhui" */'@/views/yanhui/game')
    },
    {
      path: '/yanhui/review',
      name: '演绘审核',
      component: () => import(/* webpackChunkName: "page-yanhui" */'@/views/yanhui/review')
    },
    {
      path: '/yanhui/:type?/:gid/chapters',
      name: '演绘章节',
      component: () => import(/* webpackChunkName: "page-yanhui" */'@/views/yanhui/game/chapter-list'),
      hidden: true,
      meta: {
        breadcrumb (to) {
          const name = to.params.type === 'review' ? '演绘审核' : '演绘列表'
          return { name, to: { name } }
        }
      }
    },
    {
      path: '/yanhui/material',
      name: '素材管理',
      component: () => import(/* webpackChunkName: "page-yanhui" */'@/views/yanhui/material')
    },
    {
      path: '/yanhui/material/type/:type/parent/:parent',
      name: '演绘子素材',
      component: () => import(/* webpackChunkName: "page-yanhui" */'@/views/yanhui/material/material-parts'),
      hidden: true,
      meta: {
        breadcrumb: [
          { name: '素材管理', to: { name: '素材管理' } }
        ]
      }
    },
    {
      path: '/yanhui/tag/:typeid?',
      name: '素材分类',
      component: () => import(/* webpackChunkName: "page-yanhui" */'@/views/yanhui/material-category')
    }
  ]
}
