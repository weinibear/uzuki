export default {
  name: '其他功能',
  static: true,
  icon: 'list-ul',
  children: [
    {
      path: '/message',
      name: '消息管理',
      component: () => import(/* webpackChunkName: "page-message" */'@/views/message/index')
    },
    {
      path: '/danmu',
      name: '弹幕管理',
      component: () => import(/* webpackChunkName: "page-danmu" */'@/views/danmu/index')
    },
    {
      path: '/danmu/:type/:bid/:cid',
      name: '章节弹幕',
      hidden: true,
      meta: {
        breadcrumb: { name: '弹幕管理', to: '/danmu' }
      },
      component: () => import(/* webpackChunkName: "page-danmu" */'@/views/danmu/list-detail')
    },
    {
      path: '/forgeddata',
      name: '数据注入',
      component: () => import(/* webpackChunkName: "page-forgeddata" */'@/views/forgeddata/index')
    },
    {
      path: '/splashscreen',
      name: '闪屏管理',
      component: () => import(/* webpackChunkName: "page-splashscreen" */'@/views/splashscreen/index')
    }
  ]
}
