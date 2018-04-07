
export default {
  functional: true,
  render (h, { props }) {
    const row = props.row
    const type = (props.col && props.col.type) || props.type || 'book'
    return <a href={`https://www.iqing.com/${type}/${row.id}`} target="_blank">{row.title}</a>
  }
}
