
;(function (window) {
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: function (callback, type, quality) {
        const canvas = this
        setTimeout(function () {
          const binStr = window.atob(canvas.toDataURL(type, quality).split(',')[1])
          const len = binStr.length
          const arr = new Uint8Array(len)
          for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i)
          }
          callback(new Blob([arr], {type: type || 'image/png'}))
        })
      }
    })
  }
})(window)
