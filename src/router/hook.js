import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

export default function (router) {
  router.beforeEach((to, from, next) => {
    if (to.path === from.path) {
      return next()
    }
    NProgress.start()
    next()
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
