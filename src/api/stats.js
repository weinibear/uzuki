import request from '@/utils/request'

const getStats = function (params) {
  return request.get('/statis/', { params })
}

export function getWithdrawStats (params) {
  return getStats({
    target: 'new_withdraw',
    page: 1,
    ...params
  })
}

export function getRechargeStats (params) {
  return getStats({
    target: 'recharge',
    page: 1,
    ...params
  })
}

export function getConsumptionStats (params) {
  return getStats({
    target: 'consumption',
    page: 1,
    ...params
  })
}

export function getUpdateStats (params) {
  return getStats({
    target: 'update_data',
    page: 1,
    ...params
  })
}

export function getSubscriptionStats (params) {
  return getStats({
    target: 'subscription',
    page: 1,
    ...params
  })
}

export function getOverviewStats (params) {
  return getStats({
    target: 'overview',
    page: 1,
    ...params
  })
}

export function getWorksStats (params) {
  return getStats({
    target: 'works_data',
    page: 1,
    ...params
  })
}
