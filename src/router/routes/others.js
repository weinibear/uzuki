export default function (_import) {
  return {
    name: '其他功能',
    static: true,
    icon: 'bug',
    children: [
      {
        path: '/message',
        name: '消息管理',
        component: _import('message/index')
      }
    ]
  }
}
