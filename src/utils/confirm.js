import { MessageBox } from 'element-ui'

export function confirm (method, options = {}) {
  const config = {
    title: '提示',
    message: '确认删除吗？',
    $type: 'confirm',
    showCancelButton: true,
    type: 'warning',
    ...options,
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        Promise.resolve(method()).finally(() => {
          instance.confirmButtonLoading = false
        }).then(() => {
          done()
        })
      } else {
        done()
      }
    }
  }
  return MessageBox(config)
}
