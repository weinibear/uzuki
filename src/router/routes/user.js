export default function (_import) {
  return {
    name: '用户管理',
    static: true,
    icon: 'user',
    children: [
      {
        path: '/user',
        name: '用户信息',
        component: _import('user/index')
      },
      {
        path: '/userStatus',
        name: '用户状态',
        component: _import('user/user-status')
      },
      {
        path: '/userAdmin',
        name: '管理员管理',
        component: _import('user/user-admin')
      }
    ]
  }
}
