export default {
  name: '推荐管理',
  icon: 'star',
  static: true,
  children: [
    {
      path: '/recommend',
      name: '综合推荐',
      component: () => import(/* webpackChunkName: "page-recommend" */'@/views/recommend/index')
    },
    {
      path: '/recompoints',
      name: '信仰榜推荐',
      component: () => import(/* webpackChunkName: "page-recompoints" */'@/views/recompoints/index')
    },
    {
      path: '/activity',
      name: '活动列表',
      component: () => import(/* webpackChunkName: "page-activity" */'@/views/activity/index')
    },
    {
      path: '/activity/:id',
      name: '活动详情',
      hidden: true,
      meta: {
        breadcrumb: { name: '活动列表', to: '/activity' }
      },
      component: () => import(/* webpackChunkName: "page-activity" */'@/views/activity/activity-edit')
    },
    {
      path: '/activity/:id/:type/worklist',
      name: '活动作品',
      hidden: true,
      meta: {
        breadcrumb: { name: '活动列表', to: '/activity' }
      },
      component: () => import(/* webpackChunkName: "page-activity" */'@/views/activity/activity-worklist')
    },
    {
      path: '/subject',
      name: '专题列表',
      component: () => import(/* webpackChunkName: "page-activity" */'@/views/subject/index')
    },
    {
      path: '/subject/:id',
      name: '专题详情',
      hidden: true,
      meta: {
        breadcrumb: { name: '专题列表', to: '/subject' }
      },
      component: () => import(/* webpackChunkName: "page-activity" */'@/views/activity/activity-edit')
    },
    {
      path: '/subject/:id/:type/worklist',
      name: '专题作品',
      hidden: true,
      meta: {
        breadcrumb: { name: '专题列表', to: '/subject' }
      },
      component: () => import(/* webpackChunkName: "page-activity" */'@/views/activity/activity-worklist')
    },
    {
      path: '/topic',
      name: '旧专题列表',
      component: () => import(/* webpackChunkName: "page-topic" */'@/views/topic/index')
    },
    {
      path: '/topic/:id',
      hidden: true,
      meta: {
        title: '专题详情',
        breadcrumb: { name: '旧专题列表', to: '/topic' }
      },
      component: () => import(/* webpackChunkName: "page-topic" */'@/views/topic/topic-edit')
    }
  ]
}
