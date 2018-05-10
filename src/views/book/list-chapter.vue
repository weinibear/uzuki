<template>
  <main-content
    :cols="cols"
    :get-data="getData"
    row-key="id"
    :selected.sync="selected"
    sortable
    :save-order="saveOrder">
    <el-form inline slot="header" >
      <el-button type="primary" icon="el-icon-plus" @click="add">新增章</el-button>
      <el-button type="primary" icon="el-icon-edit" @click="batchEdit">批量修改</el-button>
    </el-form>
    <dialog-chapter :data="current" ref="dialog" @success="getList"></dialog-chapter>
    <dialog-chapter-batch :data="selected" ref="dialogBatch" @success="getList"></dialog-chapter-batch>
  </main-content>
</template>

<script>
import { getChapterList, delChapter } from '@/api/book'
import { chapterStatus, chapterType } from './options'
import DialogChapter from './dialog-chapter.vue'
import DialogChapterBatch from './dialog-chapter-batch'
import { confirm } from '@/utils/confirm'
import { mapMutations } from 'vuex'

export default {
  components: { DialogChapter, DialogChapterBatch },
  data () {
    return {
      current: null,
      selected: [],
      cols: [
        {
          type: 'selection',
          width: 50
        },
        {
          label: '章节ID',
          prop: 'id',
          width: 80,
          render: (h, row) => <el-button type="text" onClick={this.link.bind(this, row)}>
            {row.id}
          </el-button>
        },
        {
          label: '序号',
          prop: 'order',
          width: 80
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
          width: 180,
          render: (h, row) => (
            <div>
              <el-button plain onClick={this.modify.bind(this, row)}>修改</el-button>
              <el-button plain type="danger" onClick={this.del.bind(this, row)}>删除</el-button>
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
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      return getChapterList(this.vid, { offset, limit })
    },
    saveOrder () {},
    add () {
      this.current = null
      this.$refs.dialog.visible = true
    },
    modify (data) {
      this.current = {...data}
      this.$refs.dialog.visible = true
    },
    batchEdit () {
      if (this.selected.length === 0) {
        return this.$message.warning('请选择章节')
      }
      this.$refs.dialogBatch.visible = true
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delChapter(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      const bid = this.$route.params.bid
      const vid = this.$route.params.vid
      this.$router.push(`/book/${bid}/volume/${vid}/chapter/${data.id}`)
    }
  }
}
</script>
