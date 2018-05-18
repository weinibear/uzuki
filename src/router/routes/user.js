export default {
  name: '用户管理',
  static: true,
  icon: 'user',
  children: [
    {
      path: '/user',
      name: '用户信息',
      component: () => import(/* webpackChunkName: "page-user" */'@/views/user/index')
    },
    {
      path: '/userStatus',
      name: '用户状态',
      component: () => import(/* webpackChunkName: "page-user" */'@/views/user/user-status')
    },
    {
      path: '/userAdmin',
      name: '管理员管理',
      component: () => import(/* webpackChunkName: "page-user" */'@/views/user/user-admin')
    }
  ]
}
