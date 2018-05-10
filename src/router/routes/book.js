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
      },
      {
        path: '/book/:bid/volumes',
        hidden: true,
        meta: {
          title: '卷目列表',
          breadcrumb: { name: '书籍列表', to: '/book/list' }
        },
        component: _import('book/list-volume')
      },
      {
        path: '/book/:bid/volume/:vid/chapters',
        hidden: true,
        meta: {
          title: '章节列表',
          breadcrumb (to) {
            const bid = to.params.bid
            return [
              { name: '书籍列表', to: '/book/list' },
              { name: '卷目列表', to: `/book/${bid}/volumes` }
            ]
          }
        },
        component: _import('book/list-chapter')
      },
      {
        path: '/book/:bid/volume/:vid/chapter/:cid',
        hidden: true,
        meta: {
          title: '章节内容',
          breadcrumb (to) {
            const bid = to.params.bid
            const vid = to.params.vid
            return [
              { name: '书籍列表', to: '/book/list' },
              { name: '卷目列表', to: `/book/${bid}/volumes` },
              { name: '章节列表', to: `/book/${bid}/volume/${vid}/chapters` }
            ]
          }
        },
        component: _import('book/chapter-content')
      }
    ]
  }
}
