export default [
  {
    path: '/booklist',
    name: '书单管理',
    icon: 'booklist',
    component: () => import(/* webpackChunkName: "page-booklist" */'@/views/booklist/index')
  },
  {
    path: '/booklist/:id',
    name: '书单作品',
    hidden: true,
    meta: {
      breadcrumb: { name: '书单管理', to: '/booklist' }
    },
    component: () => import(/* webpackChunkName: "page-booklist" */'@/views/booklist/work-list')
  }
]
