import { loadScript } from '@/utils/index'

export default function export2excel (cols, list, filename = '统计', sheetname = '1') {
  const header = cols.map(v => v.label)
  const keys = cols.map(v => v.prop)
  const data = []
  data.push(header)
  list.forEach(v => {
    const res = keys.map(key => v[key])
    data.push(res)
  })
  // import(
  //   /* webpackChunkName: "xlsx" */
  //   'xlsx'
  // )
  return loadScript('https://cdn.bootcss.com/xlsx/0.12.12/xlsx.min.js').then(XLSX => {
    const ws = XLSX.utils.aoa_to_sheet(data)
    const workbook = {
      SheetNames: [sheetname],
      Sheets: {
        [sheetname]: ws
      }
    }
    XLSX.writeFile(workbook, `${filename}.xlsx`)
  })
}
