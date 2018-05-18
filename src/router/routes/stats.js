export default function (_import) {
  return {
    name: '统计功能',
    static: true,
    icon: 'stats',
    children: [
      {
        path: '/stats/recharge',
        name: '充值统计',
        component: _import('stats/list-recharge')
      },
      {
        path: '/stats/recharge/:year/:month/:day',
        name: '充值明细',
        hidden: true,
        meta: {
          breadcrumb (to) {
            const year = to.params.year
            const month = to.params.month
            return [
              { name: '充值统计', to: `/stats/recharge?year=${year}&month=${month}` }
            ]
          }
        },
        component: _import('stats/list-recharge-detail')
      },
      {
        path: '/stats/consumption',
        name: '消费统计',
        component: _import('stats/list-consumption')
      },
      {
        path: '/stats/consumption/:year/:month/:day',
        name: '消费明细',
        hidden: true,
        meta: {
          breadcrumb (to) {
            const year = to.params.year
            const month = to.params.month
            return [
              { name: '消费统计', to: `/stats/consumption?year=${year}&month=${month}` }
            ]
          }
        },
        component: _import('stats/list-consumption-detail')
      },
      {
        path: '/stats/works',
        name: '作品统计',
        component: _import('stats/list-works')
      },
      {
        path: '/stats/works/:id',
        component: _import('stats/list-work-stat'),
        hidden: true,
        meta: {
          title: '作品明细',
          breadcrumb: { name: '作品统计', to: '/stats/works' }
        }
      },
      {
        path: '/stats/update',
        name: '更新统计',
        component: _import('stats/list-update')
      },
      {
        path: '/stats/subscription',
        name: '订阅统计',
        component: _import('stats/list-subscription')
      },
      // {
      //   path: '/stats/withdraw',
      //   name: '提现统计',
      //   component: _import('stats/list-withdraw')
      // },
      {
        path: '/stats/overview',
        name: '月度总览',
        component: _import('stats/list-overview')
      }
    ]
  }
}
