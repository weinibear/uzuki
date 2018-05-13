<template>
  <main-content :cols="cols" :get-data="getData" :page-size="50">
    <el-form
      slot="header"
      inline
      label-width="60px"
      label-suffix="：">
      <el-form-item label="筛选">
        <el-select v-model="type">
          <el-option v-for="option in messageTypes"
            :label="option.label"
            :key="option.value"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="搜索">
        <el-input
          @keyup.native.enter="search"
          v-model="inputValue"
          style="width:300px;">
          <el-select v-model="inputType" slot="prepend" style="width:120px">
            <el-option
              v-for="option in fields"
              :key="option.value"
              :label="option.label"
              :value="option.value"></el-option>
          </el-select>
          <el-button slot="append"
            @click="search"
            icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-plus" type="primary" @click="add">添加</el-button>
      </el-form-item>
    </el-form>
    <dialog-message ref="dialog" @success="getList"></dialog-message>
  </main-content>
</template>

<script>
import { getMessageList, delMessage } from '@/api/message'
import { messageTypes } from './options'
import DialogMessage from './dialog-message'
import { confirm } from '@/utils/confirm'

export default {
  components: { DialogMessage },
  data () {
    const fields = [
      { label: '接受者UID', value: 'uid' },
      { label: '关键字', value: 'key_word' }
    ]
    return {
      messageTypes,
      fields,
      inputValue: '',
      inputType: fields[0].value,
      cols: [
        {
          label: 'Id',
          prop: 'id'
        },
        {
          label: '发送者',
          prop: 'sender'
        },
        {
          label: '接受者',
          prop: 'receiver'
        },
        {
          label: '内容',
          prop: 'content',
          'min-width': 200
        },
        {
          label: '发送时间',
          component: 'col-time'
        },
        {
          label: '操作',
          render: (h, row) => (
            <div>
              <el-button plain type="danger" onClick={this.del.bind(this, row)}>删除</el-button>
            </div>
          )
        }
      ]
    }
  },
  computed: {
    type: {
      get () {
        return this.$route.query.type || this.messageTypes[0].value
      },
      set (val) {
        this.$router.push({
          query: {
            ...this.$route.query,
            type: val
          }
        })
      }
    }
  },
  methods: {
    getList () {
      this.$emit('refresh')
    },
    getData ({offset, limit}) {
      const page = Math.floor(offset / limit) + 1
      const params = {
        page,
        type: this.type
      }
      this.inputValue = this.$route.query.q || ''
      this.inputType = this.$route.query.field || this.fields[0].value
      if (this.inputValue) {
        params[this.inputType] = this.inputValue
      }
      return getMessageList(params).then(res => {
        return {
          results: res.result,
          count: res.all_count
        }
      })
    },
    search () {
      this.$router.push({
        query: {
          ...this.$route.query,
          q: this.inputValue,
          field: this.inputType,
          page: 1
        }
      })
    },
    add () {
      this.$refs.dialog.visible = true
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delMessage(data.id, this.type).then(() => {
        this.$message.success('success')
        this.getList()
      })
    }
  }
}
</script>
