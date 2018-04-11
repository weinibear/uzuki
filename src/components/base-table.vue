<template>
  <div class="base-table"
    v-loading="loading">
    <el-pagination
      v-show="total > pageSize && !sortable"
      class="top-pagination"
      small
      layout="prev, pager, next"
      :total="total"
      :page-size="innerPageSize"
      :current-page.sync="innerCurrentPage">
    </el-pagination>
    <el-table
      ref="table"
      :data="list"
      :row-key="rowKey"
      :row-class-name="sortable ? 'sortable' : ''"
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
      v-show="total > pageSize && !sortable"
      layout="prev, pager, next, total, jumper"
      background
      :total="total"
      :page-size="innerPageSize"
      :current-page.sync="innerCurrentPage">
    </el-pagination>
  </div>
</template>

<script>
import Sortable from 'sortablejs'

const components = {}

function importAll (r) {
  r.keys().forEach(key => {
    components[key.replace(/^\.\/|\.(js|vue)$/g, '')] = r(key).default
  })
}

importAll(require.context('./table-columns', false, /\.(js|vue)$/))

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
  name: 'BaseTable',
  components: {
    BaseTableCell,
    ...components
  },
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    },
    cols: Array,
    rowKey: String,
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    },
    sortable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  watch: {
    sortable (val) {
      if (val) {
        this.startSort()
      } else {
        this.cancelSort()
      }
    }
  },
  computed: {
    innerCurrentPage: {
      get () {
        return parseInt(this.$route.query.page, 10) || 1
      },
      set (page) {
        this.$router.push({
          query: { ...this.$route.query, page }
        })
      }
    },
    innerPageSize: {
      get () {
        return this.pageSize
      },
      set (val) {
        this.$emit('update:page-size', val)
      }
    }
  },
  beforeDestroy () {
    this.cancelSort()
  },
  methods: {
    startSort () {
      const el = this.$refs.table.$el.querySelector('.el-table__body tbody')
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
    },
    cancelSort () {
      if (this.sortInstance) {
        this.sortInstance.destroy()
        this.sortInstance = null
      }
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
</style>
