export default function (_import) {
  return {
    name: '推荐管理',
    icon: 'star',
    static: true,
    children: [
      {
        path: '/recommend',
        name: '综合推荐',
        component: _import('recommend/index')
      },
      {
        path: '/recompoints',
        name: '信仰榜推荐',
        component: _import('recompoints/index')
      },
      {
        path: '/activity',
        name: '活动列表',
        component: _import('activity/index')
      },
      {
        path: '/activity/:id',
        name: '活动详情',
        hidden: true,
        meta: {
          breadcrumb: { name: '活动列表', to: '/activity' }
        },
        component: _import('activity/form-activity')
      },
      {
        path: '/subject',
        name: '专题列表',
        component: _import('subject/index')
      },
      {
        path: '/subject/:id',
        name: '专题详情',
        hidden: true,
        meta: {
          breadcrumb: { name: '专题列表', to: '/subject' }
        },
        component: _import('activity/form-activity')
      }
    ]
  }
}
