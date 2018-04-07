
function importAll (r) {
  r.keys().forEach(r)
}

// 导入全部svg文件夹（不包含子目录）的svg文件

importAll(require.context('./svg', false, /\.svg$/))
