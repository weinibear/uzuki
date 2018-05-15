export default function (_import) {
  return {
    name: '其他功能',
    static: true,
    icon: 'list-ul',
    children: [
      {
        path: '/message',
        name: '消息管理',
        component: _import('message/index')
      },
      {
        path: '/danmu',
        name: '弹幕管理',
        component: _import('danmu/index')
      },
      {
        path: '/danmu/:type/:bid/:cid',
        name: '章节弹幕',
        hidden: true,
        meta: {
          breadcrumb: { name: '弹幕管理', to: '/danmu' }
        },
        component: _import('danmu/list-detail')
      },
      {
        path: '/forgeddata',
        name: '数据注入',
        component: _import('forgeddata/index')
      },
      {
        path: '/splashscreen',
        name: '闪屏管理',
        component: _import('splashscreen/index')
      }
    ]
  }
}
