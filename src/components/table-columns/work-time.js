import { formatDate } from '@/utils'

export default {
  functional: true,
  render (h, ctx) {
    const row = ctx.props.row
    const createdTime = formatDate(row.created_time)
    const updatedTime = formatDate(row.updated_time)
    return (
      <div>
        <div>{createdTime}</div>
        <div class="updated-time">{updatedTime}</div>
      </div>
    )
  }
}
