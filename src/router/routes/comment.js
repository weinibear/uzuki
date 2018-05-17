export default function (_import) {
  return {
    name: '评论管理',
    static: true,
    icon: 'comment-alt',
    children: [
      {
        path: '/brand',
        name: '板块管理',
        component: _import('comment/list-brand')
      },
      {
        path: '/brand/:bid?/post',
        name: '帖子管理',
        component: _import('comment/list-post')
      },
      {
        path: '/post/:pid?/thread',
        name: '回复管理',
        component: _import('comment/list-reply')
      },
      {
        path: '/report',
        name: '举报管理',
        component: _import('comment/list-report')
      },
      {
        path: '/comment/tag',
        name: '标签管理',
        component: _import('comment/list-tag')
      }
    ]
  }
}
