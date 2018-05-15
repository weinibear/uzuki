import { formatDate } from '@/utils'

export default {
  functional: true,
  render (h, ctx) {
    const row = ctx.props.row
    if (row.created_time && row.updated_time) {
      return (
        <div>
          <div>{formatDate(row.created_time)}</div>
          <div class="updated-time">{formatDate(row.updated_time)}</div>
        </div>
      )
    }
    return <div>{formatDate(row.created_time || row.updated_time)}</div>
  }
}
