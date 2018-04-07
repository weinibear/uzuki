/* 改造el-switch 添加默认属性 修改默认css */
import './index.scss'

export default {
  functional: true,
  name: 'BaseSwitch',
  render (h, ctx) {
    const defaultProps = {
      width: 48,
      activeText: '是',
      inactiveText: '否'
    }
    const props = { ...defaultProps, ...ctx.props }
    const textLength = Math.max(props.activeText.length, props.inactiveText.length)
    const minWidth = textLength * 14 + 34
    props.width = Math.max(minWidth, props.width)
    const data = ctx.data
    data.props = props
    data.class = { ...data.class, 'base-switch': true }
    return h('el-switch', data)
  }
}
