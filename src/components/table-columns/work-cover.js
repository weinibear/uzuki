
export default {
  functional: true,
  render (h, ctx) {
    let cover = ctx.props.row.cover
    if (!/^https?:/.test(cover)) {
      cover = `//image.iqing.com${cover}`
    }
    const smallCover = `${cover}?imageView2/2/h/120`
    const bigCover = `${cover}?imageView2/2/h/500`
    const directives = [
      { name: 'popover', arg: 'popover' }
    ]
    return (
      <div>
        <el-popover
          ref="popover"
          placement="right"
          trigger="hover">
          <img src={bigCover} alt=""/>
        </el-popover>
        <img class="img-thumbnail" {...{ directives }} src={smallCover} alt=""/>
      </div>
    )
  }
}
