<template>
  <div>
    <el-form
      inline
      label-suffix="：">
      <el-form-item
        v-for="filter in filters"
        :key="filter.prop"
        :label="filter.label">
        <el-select v-model="filter.value">
          <el-option
            v-for="option in filter.options"
            :key="option.value"
            :label="option.name"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="add">添加</el-button>
        <el-button
          v-if="!sortable"
          type="success"
          @click="startSort"
          icon="el-icon-d-caret">开始排序</el-button>
        <template v-else>
          <el-button
            @click="saveSort"
            :loading="btnSortLoading"
            type="primary">更新排序</el-button>
          <el-button
            :disabled="btnSortLoading"
            @click="cancelSort">取消排序</el-button>
        </template>
      </el-form-item>
    </el-form>
    <base-table
      :list="list"
      :cols="cols"
      :sortable="sortable"
      row-key="id"
      :loading="loading"
      :total="total" ></base-table>
    <dialog-form ref="dialog" :data="current"></dialog-form>
  </div>
</template>

<script>
import page from '@/mixins/page'
import { getRecomList, delRecom, editRecom } from '@/api/recommend'
import { recomType, recomChannel, recomWorkType } from './options'
import DialogForm from './dialog-recommend.vue'

const recomWorkTypes = [{ value: undefined, name: '全部' }].concat(recomWorkType)

export default {
  name: 'recommend',
  mixins: [page],
  components: { DialogForm },
  data () {
    const filters = [
      { label: '类型', prop: 'type', options: recomType },
      { label: '分区', prop: 'ch', options: recomChannel },
      { label: '分类', prop: 'wt', options: recomWorkTypes }
    ]
    const vm = this
    filters.forEach(obj => {
      Object.defineProperty(obj, 'value', {
        configurable: true,
        enumerable: true,
        get () {
          const value = parseInt(vm.$route.query[this.prop], 10)
          return this.options.some(v => v.value === value)
            ? value
            : this.options[0].value
        },
        set (val) {
          vm.$router.push({
            query: { ...vm.$route.query, [this.prop]: val }
          })
        }
      })
    })
    return {
      filters,
      list: [],
      total: 0,
      loading: false,
      current: null,
      sortable: false,
      btnSortLoading: false,
      cols: [
        {
          label: '封面',
          component: 'WorkCover',
          width: '200px'
        },
        {
          label: '序号',
          prop: 'order',
          width: '80px',
          align: 'center'
        },
        {
          label: '作品',
          render: (h, row) => {
            const href = <a href={row.href} target="_blank">{row.href}</a>
            return (
              <dl>
                <dt>ID</dt>
                <dd>{row.work.id}</dd>
                <dt>作品</dt>
                <dd><work-title row={row}/></dd>
                <dt>链接</dt>
                <dd>{row.href ? href : '无'}</dd>
              </dl>
            )
          }
        },
        {
          label: '详情',
          render: (h, row) => {
            return (
              <dl>
                <dt>标题</dt>
                <dd>{row.title}</dd>
                <dt>推荐语</dt>
                <dd>{row.recommend_words}</dd>
              </dl>
            )
          }
        },
        {
          label: '信息',
          render: (h, row) => {
            const types = ['info', 'success', 'warning', 'danger']
            const channel = recomChannel.find(obj => obj.value === row.channel)
            const workType = recomWorkType.find(obj => obj.value === row.work_type)
            const type = recomType.find(obj => obj.value === row.type)
            return (
              <div>
                <el-tag type={types[row.channel % 5]}>{channel ? channel.name : ''}</el-tag>
                <el-tag type={types[row.work_type % 5]}>{workType ? workType.name : ''}</el-tag>
                <el-tag type={types[row.type % 5]}>{type ? type.name : ''}</el-tag>
                <el-tag type={types[row.status % 5]}>{row.status ? '使用中' : '未启用'}</el-tag>
              </div>
            )
          }
        },
        {
          label: '操作',
          render: (h, row) => {
            return (
              <div>
                <el-button plain onClick={this.modify.bind(this, row)}>修改</el-button>
                <el-button type="danger" plain onClick={this.del.bind(this, row)}>删除</el-button>
              </div>
            )
          }
        }
      ]
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler: 'getList'
    }
  },
  computed: {
    query () {
      const result = {}
      this.filters.forEach(obj => {
        result[obj.prop] = obj.value
      })
      return result
    }
  },
  methods: {
    startSort () {
      Promise.resolve(
        this.total > this.list.length
          ? this.getList(true)
          : true
      ).then(() => {
        this.listCache = this.list.slice(0)
        this.sortable = true
      })
    },
    cancelSort () {
      this.list = this.listCache
      this.listCache = []
      this.sortable = false
    },
    saveSort () {
      const min = Math.min.apply(null, this.list.map(v => v.order))
      const rp = this.list.map((v, i) => {
        return {
          id: v.id,
          oldOrder: v.order,
          order: i + min
        }
      }).filter(v => v.oldOrder !== v.order)
        .map(this.saveOrder)
      this.btnSortLoading = true
      Promise.all(rp)
        .finally(() => {
          this.btnSortLoading = false
        })
        .then(() => {
          this.$message.success('更新成功')
          this.sortable = false
          this.getList()
        })
    },
    saveOrder ({ id, order }) {
      return editRecom(id, { order })
    },
    getList (all) {
      this.loading = true
      const params = {
        offset: this.offset,
        limit: this.limit,
        ...this.query
      }
      if (all === true) {
        params.offset = 0
        params.limit = 999
      }
      return getRecomList(params).then(data => {
        this.list = data.results
        this.total = data.count
      }).finally(() => {
        this.loading = false
      })
    },
    add () {
      const query = this.query
      this.current = {
        type: query.type,
        channel: query.ch,
        work_type: query.wt || 1
      }
      if (this.current.type === 12) {
        this.current.work_type = 6
      }
      this.$refs.dialog.visible = true
    },
    modify (data) {
      this.current = data
      this.$refs.dialog.visible = true
    },
    del (data) {
      this.$confirm('确认删除么?', {
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            return delRecom(data.id).finally(() => {
              instance.confirmButtonLoading = false
            }).then(() => {
              done()
              this.$message.success('删除成功')
              this.getList()
            })
          } else {
            done()
          }
        }
      })
    }
  }
}
</script>
