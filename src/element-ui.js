import Vue from 'vue'

import {
  Input,
  InputNumber,
  Dialog
} from 'element-ui'

Vue.prototype.$ELEMENT.size = 'small'

Input.props.clearable.default = true
InputNumber.props.controlsPosition.default = 'right'
Dialog.props.closeOnClickModal.default = false
