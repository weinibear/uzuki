<template>
  <el-dialog
    width="700px"
    :visible.sync="visible"
    :title="title">
    <el-form
      :model="form"
      ref="form"
      label-width="80px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="标题"
            prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item
            label="简介"
            prop="intro">
            <el-input type="textarea" :rows="2" v-model="form.intro"></el-input>
          </el-form-item>
          <el-form-item
            label="分类"
            prop="categories">
            <el-select
              popper-class="v-category-select"
              v-model="form.categories"
              multiple >
              <el-option
                v-for="item in categoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="连载"
            prop="end">
            <el-select v-model="form.end">
              <el-option label="连载" :value="0"></el-option>
              <el-option label="完结" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="封面"
            prop="cover">
            <img-cropper :src.sync="form.cover"></img-cropper>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付费" prop="need_pay">
            <el-select v-model="form.need_pay">
              <el-option label="免费" :value="0"></el-option>
              <el-option label="付费" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input v-model="form.price"></el-input>
          </el-form-item>
          <el-form-item label="付费方式" prop="chargeMethod">
            <el-select v-model="form.chargeMethod">
              <el-option label="按书计费" :value="1"></el-option>
              <el-option label="按章计费" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="章收费" prop="chapterCharge">
            <el-select v-model="form.chapterCharge">
              <el-option label="按章-固定价格" :value="1"></el-option>
              <el-option label="按章-千字计价" :value="2"></el-option>
              <el-option label="按章-千字+图片计价" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计费点" prop="payFrom">
            <el-input v-model.number="form.payFrom"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="save"
        :loading="btnLoading">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { updateChannelBook } from '@/api/output'

export default {
  props: {
    data: Object
  },
  data () {
    return {
      visible: false,
      btnLoading: false,
      form: {
        title: '',
        intro: '',
        cover: '',
        categories: [],
        end: 0,
        need_pay: 0,
        price: 0,
        chargeMethod: 1,
        chapterCharge: 1,
        payFrom: 0
      }
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
      Promise.resolve(
        this.id
          ? updateChannelBook(this.id, form)
          : null
      ).finally(() => {
        this.btnLoading = false
      }).then(() => {
        this.$message.success('保存成功')
        this.visible = false
        this.$emit('success')
      })
    }
  }
}
</script>
