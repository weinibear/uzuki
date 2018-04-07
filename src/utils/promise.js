/* eslint-disable */
require('es6-promise').polyfill()

if (!Promise.prototype.finally) {
  Promise.prototype.finally = function (cb) {
    let P = this.constructor
    return this.then(
      value => P.resolve(cb()).then(() => value),
      error => P.resolve(cb()).then(() => { throw error })
    )
  }
}
