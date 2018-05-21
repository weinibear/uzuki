import { Notification } from 'element-ui'
import localStore from './utils/localStore'

function showUpgradeInfo (value) {
  const KEY = 'uzuki_updated_info'
  if (value && localStore.get(KEY) !== value) {
    Notification({
      title: '更新~\\(≧▽≦)/~',
      message: '更新了...',
      duration: 0,
      onClose () {
        localStore.set(KEY, value)
      },
      type: 'success'
    })
  }
}

export default showUpgradeInfo
