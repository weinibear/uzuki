import axios from 'axios'
import { Message } from 'element-ui'

const debug = process.env.NODE_ENV !== 'production'

const request = axios.create({
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'x-csrftoken',
  timeout: 15000,
  headers: {
    common: {}
  }
})

if (debug) {
  request.defaults.headers.common['x-dev'] = 'on'
}

request.interceptors.response.use(function (res) {
  const data = res.data
  if (data.hasOwnProperty('code') && data.code !== 0 && data.code !== 200) {
    Message({
      message: String(data.msg || data.data || data.code),
      type: 'error'
    })
    return Promise.reject(data)
  }
  return data
}, function (err) {
  const msg = (err.response && err.response.data && err.response.data.detail) || err.message
  Message({
    message: msg,
    type: 'error'
  })
  return Promise.reject(err)
})

export default request
