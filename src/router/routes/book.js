export default function (_import) {
  return {
    name: '书籍管理',
    static: true,
    icon: 'book',
    children: [
      {
        path: '/book/list',
        name: '书籍列表',
        component: _import('book/index')
      }
    ]
  }
}
