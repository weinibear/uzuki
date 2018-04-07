# uzuki

> 轻文主站后台管理

## ESLint
代码规范参考
### [JavaScript Standard Style](https://standardjs.com/rules.html)

* 使用两个空格 – 进行缩进
* 字符串使用单引号 – 需要转义的地方除外
* 不再有冗余的变量 – 这是导致 大量 bug 的源头!
* 无分号 – 这没什么不好。不骗你！
* 行首不要以 (, [, or ` 开头
  * 这是省略分号时唯一会造成问题的地方 – 工具里已加了自动检测！
* 关键字后加空格 if (condition) { ... }
* 函数名后加空格 function name (arg) { ... }
* 坚持使用全等 === 摒弃 == 一但在需要检查 null || undefined 时可以使用 obj == null。
* 使用浏览器全局变量时加上 window 前缀 – document 和 navigator 除外
  * 避免无意中使用到了这些命名看上去很普通的全局变量， open, length, event 还有 name。

### [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue)
* 标签缩进2个空格
* 模板中每行最多一个属性, 多个属性需要换行


## svg-icon 使用方式

icons/fa文件夹是Font Awesome提供是svg图标文件

将icons/fa文件夹或其他地方的.svg文件放入icons/svg文件夹就会自动导入

```html
  <!-- icon为svg文件名  -->
  <svg-icon icon="lock" />
```
