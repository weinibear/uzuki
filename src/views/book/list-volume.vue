<template>
  <main-content
    :cols="cols"
    :get-data="getData"
    row-key="id"
    sortable
    :save-order="saveOrder">
    <el-button slot="header" type="primary" @click="add" icon="el-icon-plus">添加卷</el-button>
  </main-content>
</template>

<script>
import { getVolumeList, updateVolume, delVolume, createVolume } from '@/api/book'
import { mapMutations } from 'vuex'
import { confirm } from '@/utils/confirm'

export default {
  data () {
    return {
      cols: [
        {
          label: '卷ID',
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
          label: '状态',
          render: (h, row) => <span>{row.status ? '可见' : '不可见'}</span>
        },
        {
          label: '字数',
          prop: 'count'
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
              <el-button plain type="primary" onClick={this.link.bind(this, row)}>章节</el-button>
              <el-button plain onClick={this.modify.bind(this, row)}>修改</el-button>
              <el-button plain type="danger" onClick={this.del.bind(this, row)}>删除</el-button>
            </div>
          )
        }
      ]
    }
  },
  computed: {
    bid () {
      return this.$route.params.bid
    }
  },
  methods: {
    ...mapMutations('app', ['pushBreadcrumb']),
    getList () {
      this.$emit('refresh')
    },
    getData ({ offset, limit }) {
      return getVolumeList(this.bid, { offset, limit })
    },
    saveOrder ({ id, order }) {
      return updateVolume(id, { order })
    },
    add () {
      this.$prompt('请输入卷名', '添加', {
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return createVolume(this.bid, { title: instance.inputValue }).finally(() => {
              instance.confirmButtonLoading = false
            }).then(() => {
              done()
              this.$message.success('success')
              this.getList()
            })
          } else {
            done()
          }
        }
      })
    },
    modify (data) {
      this.$prompt('请输入卷名', '修改', {
        inputValue: data.title,
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return updateVolume(data.id, { title: instance.inputValue }).finally(() => {
              instance.confirmButtonLoading = false
            }).then(() => {
              done()
              this.$message.success('success')
              this.getList()
            })
          } else {
            done()
          }
        }
      })
    },
    del (data) {
      confirm(this.delData.bind(this, data))
    },
    delData (data) {
      return delVolume(data.id).then(() => {
        this.$message.success('success')
        this.getList()
      })
    },
    link (data) {
      this.pushBreadcrumb({ to: '', name: data.title })
      const bid = this.$route.params.bid
      this.$router.push(`/book/${bid}/volume/${data.id}/chapters`)
    }
  }
}
</script>
