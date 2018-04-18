import { MessageBox } from 'element-ui'

export function confirm ({ message = '确认删除吗?', title = '提示', type = 'confirm', method }) {
  return MessageBox({
    title,
    message,
    $type: type,
    showCancelButton: true,
    type: 'warning',
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
  })
}
