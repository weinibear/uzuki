<template>
  <main>
    <div class="header">
      <slot name="header"></slot>
      <div class="btn-sort" v-if="sortable">
        <el-button
          v-if="!sortInstance"
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
      </div>
    </div>
    <div class="base-table"
      v-loading="loading">
      <el-pagination
        v-show="total > limit && !sortInstance"
        class="top-pagination"
        small
        layout="prev, pager, next"
        :total="total"
        :page-size="limit"
        :current-page.sync="currentPage">
      </el-pagination>
      <el-table
        ref="table"
        :data="list"
        :row-key="rowKey"
        :row-class-name="sortInstance ? 'sortable' : ''"
        border>
        <template v-for="(col, index) in cols">
          <slot v-if="col.slot"
            :name="col.slot" />
          <el-table-column
            v-bind="col"
            v-else
            :key="index">
            <template slot-scope="scope">
              <base-table-cell
                v-if="col.render"
                :row="scope.row"
                :index="scope.$index"
                :render="col.render"
              />
              <component
                v-else-if="col.component"
                :is="col.component"
                :row="scope.row"
                :index="scope.$index"
                :col="col"
              />
              <span v-else>{{scope.row[col.prop]}}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <el-pagination
        class="bottom-pagination"
        v-show="total > limit && !sortInstance"
        layout="prev, pager, next, total, jumper"
        background
        :total="total"
        :page-size="limit"
        :current-page.sync="currentPage">
      </el-pagination>
    </div>
    <slot></slot>
  </main>
</template>

<script>
import Sortable from 'sortablejs'

const BaseTableCell = {
  name: 'BaseTableCell',
  functional: true,
  render: (h, ctx) => {
    const row = ctx.props.row
    const index = ctx.props.index
    return ctx.props.render(h, row, index)
  }
}

export default {
  name: 'MainContent',
  components: {
    BaseTableCell
  },
  props: {
    cols: Array,
    getData: {
      type: Function,
      required: true
    },
    rowKey: String,
    pageSize: {
      type: Number,
      default: 10
    },
    sortable: {
      type: Boolean,
      default: false
    },
    saveOrder: {
      type: Function
    }
  },
  data () {
    return {
      loading: false,
      list: [],
      limit: this.pageSize,
      total: 0,
      sortInstance: null,
      btnSortLoading: false
    }
  },
  watch: {
    '$route': {
      immediate: true,
      handler () {
        this.getList()
      }
    }
  },
  computed: {
    currentPage: {
      get () {
        return parseInt(this.$route.query.page, 10) || 1
      },
      set (page) {
        this.$router.push({
          query: { ...this.$route.query, page }
        })
      }
    },
    offset () {
      return (this.currentPage - 1) * this.limit
    }
  },
  created () {
    this.$parent.$on('refresh', this.getList)
  },
  beforeDestroy () {
    this.destroySort()
  },
  methods: {
    getList (args = {}) {
      const params = {
        offset: this.offset,
        limit: this.limit,
        ...args
      }
      if (typeof this.getData === 'function') {
        this.loading = true
        return this.getData(params)
          .then(({ results, count }) => {
            this.list = results
            this.total = count
          })
          .finally(() => {
            this.loading = false
          })
      }
      console.warn('需要this.getData方法', this)
      return Promise.resolve()
    },
    startSort () {
      const el = this.$refs.table.$el.querySelector('.el-table__body tbody')
      Promise.resolve(
        this.total > this.limit
          ? this.getList({ offset: 0, limit: 999 })
          : true
      ).then(() => {
        this.sortInstance = Sortable.create(el, {
          onUpdate: (evt) => {
            const node = evt.item
            node.parentElement.removeChild(node)
            const fatherNode = evt.from
            const position = evt.oldIndex
            const refNode = (position === 0) ? fatherNode.children[0] : fatherNode.children[position - 1].nextSibling
            fatherNode.insertBefore(node, refNode)
            this.list.splice(evt.newIndex, 0, this.list.splice(evt.oldIndex, 1)[0])
          }
        })
      })
    },
    destroySort () {
      if (this.sortInstance) {
        this.sortInstance.destroy()
        this.sortInstance = null
      }
    },
    cancelSort () {
      this.destroySort()
      this.getList()
    },
    saveSort () {
      let min = Math.min.apply(null, this.list.map(v => v.order))
      if (min < 0) {
        min = 0
      }
      this.btnSortLoading = true
      const rp = this.list.map((v, i) => {
        return {
          id: v.id,
          oldOrder: v.order,
          order: i + min
        }
      }).filter(v => v.oldOrder !== v.order)
        .map(this.saveOrder)
      Promise.all(rp)
        .finally(() => {
          this.btnSortLoading = false
        })
        .then(() => {
          this.$message.success('更新成功')
          this.cancelSort()
        })
    }
  }
}
</script>

<style lang="scss">
.el-table {
  th {
    background-color: #eef0f6;
  }
  .cell {
    max-height: 150px;
    overflow-y: auto;
  }
}
.sortable {
  cursor: move;
}
</style>

<style lang="scss" scoped>
.base-table {
  position: relative;
  margin: 18px 0;
  .top-pagination {
    position: absolute;
    right: 0;
    top: -18px;
    transform: translateY(-100%);
  }
  .bottom-pagination {
    margin-top: 18px;
  }
  .img-thumbnail {
    padding: 4px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    transition: all .2s ease-in-out;
    display: inline-block;
    max-width: 100%;
    height: 130px;
  }
  .updated-time {
    display: inline-block;
    border-top: 1px solid #aaa;
  }
}
.header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
}
.btn-sort {
  margin-left: 10px;
  &:first-child {
    margin-left: 0;
  }
}
</style>