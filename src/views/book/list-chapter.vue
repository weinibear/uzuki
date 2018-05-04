<template>
  <main-content
    :cols="cols"
    :get-data="getData"
    row-key="id"
    sortable
    :save-order="saveOrder">
    <el-form inline slot="header" >
      <el-button type="primary" icon="el-icon-plus">新增章</el-button>
    </el-form>
  </main-content>
</template>

<script>
import { getChapterList } from '@/api/book'
import { chapterStatus, chapterType } from './options'

export default {
  data () {
    return {
      cols: [
        {
          label: '章节ID',
          prop: 'id'
        },
        {
          label: '序号',
          prop: 'order'
        },
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '作者的话',
          prop: 'whisper'
        },
        {
          label: '字数',
          prop: 'count'
        },
        {
          label: '信息',
          render: (h, row) => {
            const item = chapterType.find(obj => row.type === obj.value) || { tag: 'danger', label: '未知' }
            return <el-tag type={item.tag}>{item.label}</el-tag>
          }
        },
        {
          label: '状态',
          render: (h, row) => {
            const item = chapterStatus.find(obj => row.status === obj.value) || { tag: 'danger', label: '未知' }
            return <el-tag type={item.tag}>{item.label}</el-tag>
          }
        },
        {
          label: '创建/更新时间',
          component: 'col-time'
        },
        {
          label: '操作',
          width: 240,
          render: (h, row) => (
            <div>
              <el-button>内容</el-button>
              <el-button>修改</el-button>
              <el-button>删除</el-button>
            </div>
          )
        }
      ]
    }
  },
  computed: {
    vid () {
      return this.$route.params.vid
    }
  },
  methods: {
    getData ({ offset, limit }) {
      return getChapterList(this.vid, { offset, limit })
    },
    saveOrder () {}
  }
}
</script>
