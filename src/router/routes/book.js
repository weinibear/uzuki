export default {
  name: '书籍管理',
  static: true,
  icon: 'book',
  children: [
    {
      path: '/book/list',
      name: '书籍列表',
      component: () => import(/* webpackChunkName: "page-book" */'@/views/book/index')
    },
    {
      path: '/book/:bid/volumes',
      hidden: true,
      meta: {
        title: '卷目列表',
        breadcrumb: { name: '书籍列表', to: '/book/list' }
      },
      component: () => import(/* webpackChunkName: "page-book" */'@/views/book/list-volume')
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
      component: () => import(/* webpackChunkName: "page-book" */'@/views/book/list-chapter')
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
      component: () => import(/* webpackChunkName: "page-book" */'@/views/book/chapter-content')
    },
    {
      path: '/book/review',
      name: '书籍审核',
      component: () => import(/* webpackChunkName: "page-book" */'@/views/book-review/index')
    },
    {
      path: '/book/review/:id',
      hidden: true,
      meta: {
        title: '章节审核',
        breadcrumb: { name: '书籍审核', to: '/book/review' }
      },
      component: () => import(/* webpackChunkName: "page-book" */'@/views/book-review/list-chapter')
    },
    {
      path: '/book/end',
      name: '完结审核',
      component: () => import(/* webpackChunkName: "page-book" */'@/views/book-end/index')
    },
    {
      path: '/book/input',
      name: 'book-input',
      meta: {
        title: '渠道书籍 ' // 区别渠道管理的渠道书籍
      },
      component: () => import(/* webpackChunkName: "page-book" */'@/views/book/index')
    }
  ]
}
