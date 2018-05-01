import request from '@/utils/request'
import qs from 'qs'

/**
 * 获取用户列表
 * @param {*} params { page, value, keywork, target }
 */
export function getUserList (params) {
  return request.get('/user_info/', { params })
}

/**
 * 获取用户信息
 * @param {*} uid
 */
export function getUserProfile (uid) {
  return request.get('/user_info/', {
    params: {
      uid,
      target: 'user_info'
    }
  })
}

/**
 * 更新用户信息
 * @param {*} data
 */
export function updateUserProfile (data) {
  data.target = 'user_info'
  return request.post('/user_info/', qs.stringify(data))
}

/**
 * 获取用户实名信息
 * @param {*} uid
 */
export function getUserRealInfo (uid) {
  return request.get('/user_info/', {
    params: {
      uid,
      target: 'real_name'
    }
  })
}

/**
 * 更新实名信息
 * @param {*} data
 */
export function updateUserRealInfo (data) {
  data.target = 'real_name'
  return request.post('/user_info/', qs.stringify(data))
}

/**
 * 重置密码
 * @param {*} uid
 * @param {*} password
 */
export function updateUserPassword (uid, password) {
  const data = {
    target: 'user_password',
    uid,
    password
  }
  return request.post('/user_info/', qs.stringify(data))
}

/**
 * 管理用户状态
 * @param {*} data
 */
export function updateUserStatus (data) {
  data.target = 'user_status'
  return request.post('/user_info/', qs.stringify(data))
}

/**
 * 创建管理员
 * @param {*} uid
 */
export function createAdmin (uid) {
  const data = {
    uid,
    status: 'add',
    target: 'admin'
  }
  return request.post('/user_info/', qs.stringify(data))
}

/**
 * 移除管理员
 * @param {*} uid
 */
export function delAdmin (uid) {
  const data = {
    uid,
    status: 'remove',
    target: 'admin'
  }
  return request.post('/user_info/', qs.stringify(data))
}
