export default {
  name: '钱包管理',
  static: true,
  icon: 'wallet',
  children: [
    {
      path: '/wallet/payment',
      name: '稿费管理',
      component: () => import(/* webpackChunkName: "page-stats" */'@/views/stats/list-payment')
    },
    {
      path: '/wallet/payment/:id',
      hidden: true,
      component: () => import(/* webpackChunkName: "page-stats" */'@/views/stats/list-payment-detail'),
      meta: {
        title: '作品明细',
        breadcrumb: { name: '稿费管理', to: '/wallet/payment' }
      }
    },
    {
      path: '/wallet/cash',
      name: '收入管理',
      component: () => import(/* webpackChunkName: "page-wallet" */'@/views/wallet/list-amount')
    },
    {
      path: '/wallet/coin',
      name: '轻石管理',
      component: () => import(/* webpackChunkName: "page-wallet" */'@/views/wallet/list-amount')
    },
    {
      path: '/wallet/gold',
      name: '重石管理',
      component: () => import(/* webpackChunkName: "page-wallet" */'@/views/wallet/list-amount')
    },
    {
      path: '/wallet/coin/:uid',
      name: '轻石记录',
      hidden: true,
      meta: {
        breadcrumb: { name: '轻石管理', to: '/wallet/coin' }
      },
      component: () => import(/* webpackChunkName: "page-wallet" */'@/views/wallet/list-record')
    },
    {
      path: '/wallet/gold/:uid',
      name: '重石记录',
      hidden: true,
      meta: {
        breadcrumb: { name: '重石管理', to: '/wallet/gold' }
      },
      component: () => import(/* webpackChunkName: "page-wallet" */'@/views/wallet/list-record')
    },
    {
      path: '/wallet/cash/:uid/balance',
      name: '收支记录',
      hidden: true,
      meta: {
        breadcrumb: { name: '收入管理', to: '/wallet/cash' }
      },
      component: () => import(/* webpackChunkName: "page-wallet" */'@/views/wallet/list-record')
    },
    {
      path: '/wallet/cash/:uid/withdraw',
      name: '提现记录',
      hidden: true,
      meta: {
        breadcrumb: { name: '收入管理', to: '/wallet/cash' }
      },
      component: () => import(/* webpackChunkName: "page-wallet" */'@/views/wallet/list-withdraw')
    }
  ]
}
