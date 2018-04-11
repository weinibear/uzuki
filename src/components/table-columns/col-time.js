import { formatDate } from '@/utils'

export default {
  functional: true,
  render (h, ctx) {
    const row = ctx.props.row
    const createdTime = formatDate(row.created_time)
    let update = ''
    if (row.updated_time) {
      const updatedTime = formatDate(row.updated_time)
      update = <div class="updated-time">{updatedTime}</div>
    }
    return (
      <div>
        <div>{createdTime}</div>
        {update}
      </div>
    )
  }
}
