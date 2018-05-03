import request from '@/utils/request'
import qs from 'qs'

const getWalletList = function (params) {
  return request.get('/wallet_manager/', { params })
}

export function postWallet (data) {
  return request.post('/wallet_manager/', qs.stringify(data))
}

export function getCoinList (params) {
  return getWalletList({
    target: 'amount',
    currency: 'coin',
    ...params
  })
}

export function getGoldList (params) {
  return getWalletList({
    target: 'amount',
    currency: 'gold',
    ...params
  })
}

export function getCashList (params) {
  return getWalletList({
    target: 'amount',
    currency: 'cash',
    ...params
  })
}

export function getGoldRecord (uid, offset, limit) {
  return request.get(`/user/${uid}/gold_ticket/`, {
    params: {
      offset,
      limit
    }
  })
}

export function getCoinRecord (uid, offset, limit) {
  return request.get(`/user/${uid}/coin_ticket/`, {
    params: {
      offset,
      limit
    }
  })
}

export function getBalanceRecord (uid, offset, limit) {
  return request.get(`/user/${uid}/balance/`, {
    params: {
      offset,
      limit
    }
  })
}

export function getWithdrawRecord (uid, offset, limit) {
  return request.get(`/user/${uid}/withdraw/`, {
    params: {
      offset,
      limit
    }
  })
}
