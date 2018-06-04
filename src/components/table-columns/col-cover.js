
export default {
  functional: true,
  render (h, ctx) {
    const prop = ctx.props.col.prop || 'cover'
    const index = ctx.props.index
    let cover = ctx.props.row[prop]
    if (/^(https?:)?\/\/[^/]*/.test(cover)) {
      cover = cover.replace(/^https?:/, '')
    } else {
      cover = `//image.iqing.com${cover}`
    }
    const smallCover = `${cover}?imageMogr2/thumbnail/x120`
    const bigCover = `${cover}?imageMogr2/thumbnail/x500`
    const ref = 'cover' + index
    const directives = [
      { name: 'popover', arg: ref }
    ]
    return (
      <div>
        <el-popover
          ref={ref}
          placement="right"
          trigger="click">
          <img style="max-height: 500px" src={bigCover} alt=""/>
        </el-popover>
        <img class="img-thumbnail" {...{ directives }} src={smallCover} alt=""/>
      </div>
    )
  }
}
