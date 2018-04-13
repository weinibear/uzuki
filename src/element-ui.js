
import {
  Pagination,
  Dialog,
  // Autocomplete,
  // Dropdown,
  // DropdownMenu,
  // DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  // DatePicker,
  // TimeSelect,
  // TimePicker,
  Popover,
  // Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  // Tabs,
  // TabPane,
  Tag,
  // Tree,
  // Alert,
  // Slider,
  // Icon,
  Row,
  Col,
  Upload,
  // Progress,
  // Spinner,
  // Badge,
  // Card,
  // Rate,
  // Steps,
  // Step,
  // Carousel,
  Scrollbar,
  // CarouselItem,
  // Collapse,
  // CollapseItem,
  // Cascader,
  // ColorPicker,
  // Transfer,
  // Container,
  // Header,
  // Aside,
  // Main,
  // Footer
  Loading,
  MessageBox,
  Message
} from 'element-ui'

const components = [
  Pagination,
  Dialog,
  // Autocomplete,
  // Dropdown,
  // DropdownMenu,
  // DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  // DatePicker,
  // TimeSelect,
  // TimePicker,
  Popover,
  // Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  // Tabs,
  // TabPane,
  Tag,
  // Tree,
  // Alert,
  // Slider,
  // Icon,
  Row,
  Col,
  Upload,
  // Progress,
  // Spinner,
  // Badge,
  // Card,
  // Rate,
  // Steps,
  // Step,
  // Carousel,
  Scrollbar
  // CarouselItem,
  // Collapse,
  // CollapseItem,
  // Cascader,
  // ColorPicker,
  // Transfer,
  // Container,
  // Header,
  // Aside,
  // Main,
  // Footer
]

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.use(Loading.directive)

  const ELEMENT = {}
  ELEMENT.size = opts.size || ''

  Vue.prototype.$loading = Loading.service
  Vue.prototype.$msgbox = MessageBox
  Vue.prototype.$alert = MessageBox.alert
  Vue.prototype.$confirm = MessageBox.confirm
  Vue.prototype.$prompt = MessageBox.prompt
  Vue.prototype.$message = Message

  Vue.prototype.$ELEMENT = ELEMENT
}

export default {
  install
}
