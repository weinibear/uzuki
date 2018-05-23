import { parseCount } from '@/utils/index'

export default function (vm) {
  return [
    {
      label: '书籍ID',
      prop: 'id',
      width: 80,
      render: (h, row) => <el-button type="text" onClick={vm.link.bind(vm, row)}>
        {row.id}
      </el-button>
    },
    {
      label: '封面',
      width: 120,
      component: 'col-cover'
    },
    {
      label: '标题/作者',
      render: (h, row) => (
        <dl>
          <dt>标题</dt>
          <dd><col-title row={row} type="book"></col-title></dd>
          <dt>作者</dt>
          <dd>{row.author_name}</dd>
        </dl>
      )
    },
    {
      label: '简介',
      render: (h, row) => <div class="intro">{row.intro}</div>
    },
    {
      label: '数据',
      width: 120,
      render: (h, row) => (
        <dl>
          <dt>字数</dt>
          <dd>
            <el-tooltip content={String(row.count)} placement="top-start">
              <span>{parseCount(row.count)}</span>
            </el-tooltip>
          </dd>
          <dt>点击</dt>
          <dd>
            <el-tooltip content={String(row.views)} placement="top-start">
              <span>{parseCount(row.views)}</span>
            </el-tooltip>
          </dd>
          <dt>收藏</dt>
          <dd>
            <el-tooltip content={String(row.follow_count)} placement="top-start">
              <span>{parseCount(row.follow_count)}</span>
            </el-tooltip>
          </dd>
          <dt>轻石</dt>
          <dd>
            <el-tooltip content={String(row.coin)} placement="top-start">
              <span>{parseCount(row.coin)}</span>
            </el-tooltip>
          </dd>
          <dt>重石</dt>
          <dd>
            <el-tooltip content={String(row.gold)} placement="top-start">
              <span>{parseCount(row.gold)}</span>
            </el-tooltip>
          </dd>
        </dl>
      )
    },
    {
      label: '分类',
      width: 80,
      render: (h, row) => row.categories.map(item => <el-tag>{item.name}</el-tag>)
    },
    {
      label: '创建/更新时间',
      width: 150,
      component: 'col-time'
    }
  ]
}
