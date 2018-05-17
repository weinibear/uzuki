import { mapState, mapActions } from 'vuex'
import { updateBook } from '@/api/book'
import { rankOptions, channelOptions, needPayOptions, endOptions, groupOptions, buyTypes } from './options'

export default {
  props: {
    data: Object
  },
  data () {
    const rules = {
      title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
      intro: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
      cover: [{ required: true, message: '封面不能为空', trigger: 'blur' }]
    }
    return {
      visible: false,
      btnLoading: false,
      form: {
        title: '',
        author_name: '',
        press: '',
        categories: [],
        keyword: '',
        channel: 10,
        rank: 1,
        end: 0,
        need_pay: 0,
        discount: 100,
        group: 0,
        pay_combo: 1,
        follow_add: 0,
        follow_combo: 1,
        intro: '',
        cover: '',
        buy_type: 0
      },
      rules
    }
  },
  computed: {
    ...mapState('category', ['categoryList']),
    id () {
      return this.data && this.data.id
    },
    title () {
      return this.id ? '修改书籍' : '添加书籍'
    }
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.data) {
          this.$nextTick().then(() => {
            Object.keys(this.form).forEach(key => {
              if (this.data.hasOwnProperty(key)) {
                this.form[key] = this.data[key]
              }
            })
          })
        }
      } else {
        this.$refs.form.resetFields()
      }
    }
  },
  created () {
    this.getCategoryCache()
  },
  methods: {
    ...mapActions('category', ['getCategoryCache']),
    save () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submit()
        }
      })
    },
    submit () {
      this.btnLoading = true
      const form = { ...this.form }
      form.categories = form.categories.join()
      form.cover = form.cover.replace(/^https?:\/\/[^/]*/, '')
      Promise.resolve(
        this.id
          ? updateBook(this.id, form)
          : null
      ).finally(() => {
        this.btnLoading = false
      }).then(() => {
        this.$message.success('保存成功')
        this.visible = false
        this.$emit('success')
      })
    },
    sync (prop, value) {
      this.form[prop] = value
    }
  },
  render (h) {
    const left = [
      { prop: 'title', label: '标题' },
      { prop: 'author_name', label: '作者' },
      { prop: 'press', label: '出品' },
      { prop: 'keyword', label: '关键词' }
    ].map(item => (
      <el-form-item
        key={item.prop}
        label={item.label}
        prop={item.prop}>
        <el-input value={this.form[item.prop]} onInput={this.sync.bind(this, item.prop)}></el-input>
      </el-form-item>
    )).concat(<el-form-item
      label="分类"
      prop="categories">
      <el-select
        popper-class="v-category-select"
        value={this.form.categories} onInput={this.sync.bind(this, 'categories')}
        multiple >
        {this.categoryList.map(v => <el-option label={v.name} value={v.id} key={v.id}></el-option>)}
      </el-select>
    </el-form-item>)

    const cover = <el-form-item
      label="封面"
      prop="cover">
      <img-cropper src={this.form.cover}
        height={235}
        onChange={this.sync.bind(this, 'cover')}></img-cropper>
    </el-form-item>

    const selects = [
      { prop: 'need_pay', label: '是否付费', options: needPayOptions },
      { prop: 'channel', label: '分区', options: channelOptions },
      { prop: 'rank', label: '等级', options: rankOptions },
      { prop: 'group', label: '分组', options: groupOptions },
      { prop: 'end', label: '连载状态', options: endOptions },
      { prop: 'pay_combo', label: '订阅倍率', type: 'number' },
      { prop: 'follow_add', label: '收藏偏移', type: 'number' },
      { prop: 'follow_combo', label: '收藏倍率', type: 'number' },
      { prop: 'discount', label: '折扣', type: 'number' },
      { prop: 'buy_type', label: '购买方式', options: buyTypes }
    ].map(item => {
      let com
      if (item.type === 'number') {
        com = <el-input-number
          min={0}
          value={this.form[item.prop]}
          onInput={this.sync.bind(this, item.prop)}></el-input-number>
      } else {
        com = <el-select value={this.form[item.prop]}
          onInput={this.sync.bind(this, item.prop)}>
          {item.options.map(option => <el-option label={option.label} value={option.value}></el-option>)}
        </el-select>
      }
      return (
        <el-col
          span={6}
          key={item.prop}>
          <el-form-item label={item.label} prop={item.prop}>
            {com}
          </el-form-item>
        </el-col>
      )
    })
    const intro = <el-col span={24}>
      <el-form-item label="简介" prop="intro">
        <el-input type="textarea" rows={4} value={this.form.intro} onInput={this.sync.bind(this, 'intro')}></el-input>
      </el-form-item>
    </el-col>

    const dialog = (
      <el-dialog
        width="900px"
        top="5vh"
        visible={this.visible}
        onClose={() => (this.visible = false)}
        closeOnClickModal={this.hehe}
        title={this.tille}>
        <el-form
          model={this.form}
          rules={this.rules}
          ref="form"
          label-width="80px">
          <el-row gutter={10}>
            <el-col span={12}>{left}</el-col>
            <el-col span={12}>{cover}</el-col>
            {selects}
            {intro}
          </el-row>

        </el-form>
        <div slot="footer">
          <el-button onClick={() => (this.visible = false)}>取 消</el-button>
          <el-button
            type="primary"
            onClick={this.save}
            loading={this.btnLoading}>确 定</el-button>
        </div>
      </el-dialog>
    )
    return dialog
  }
}
