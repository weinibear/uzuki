export default function (_import) {
  return [
    {
      name: '渠道管理',
      static: true,
      icon: 'chrome',
      children: [
        {
          path: '/output/books',
          name: '渠道书籍',
          component: _import('output/index')
        },
        {
          path: '/output/channels',
          name: '渠道列表',
          component: _import('output/list-channel')
        },
        {
          path: '/output/book/:bid',
          name: '渠道卷目管理',
          hidden: true,
          meta: {
            title: '卷目列表',
            breadcrumb: { name: '渠道书籍', to: '/output/book' }
          },
          component: _import('output/list-volume')
        },
        {
          path: '/output/book/:bid/volume/:vid',
          name: '渠道章节管理',
          hidden: true,
          meta: {
            title: '章节列表',
            breadcrumb (to) {
              const bid = to.params.bid
              return [
                { name: '渠道书籍', to: '/output/book' },
                { name: '卷目列表', to: `/output/book/${bid}` }
              ]
            }
          },
          component: _import('output/list-chapter')
        },
        {
          path: '/output/book/:bid/volume/:vid/chapter/:cid',
          name: '渠道章节内容',
          hidden: true,
          meta: {
            title: '章节内容',
            breadcrumb (to) {
              const bid = to.params.bid
              const vid = to.params.vid
              return [
                { name: '渠道书籍', to: '/output/book' },
                { name: '卷目列表', to: `/output/book/${bid}` },
                { name: '章节列表', to: `/output/book/${bid}/volume/${vid}` }
              ]
            }
          },
          component: _import('output/content-chapter')
        }
      ]
    }
  ]
}
