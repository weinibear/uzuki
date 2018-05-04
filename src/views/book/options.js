
export const statusOptions = [
  {
    label: '草稿',
    value: 0,
    tag: 'info'
  },
  {
    label: '部分通过',
    value: 2,
    tag: 'success'
  },
  {
    label: '审核中',
    value: 3,
    tag: 'warning'
  },
  {
    label: '未通过',
    value: 4,
    tag: 'info'
  },
  {
    label: '全部通过',
    value: 6,
    tag: 'success'
  },
  {
    label: '已退回',
    value: 7,
    tag: 'danger'
  }
]

export const rankOptions = [
  {
    label: '初始',
    value: 1,
    tag: 'primary'
  },
  {
    label: '已审',
    value: 2,
    tag: 'primary'
  },
  {
    label: 'B签',
    value: 3,
    tag: 'primary'
  },
  {
    label: 'A签',
    value: 4,
    tag: 'primary'
  },
  {
    label: 'C签',
    value: 5,
    tag: 'primary'
  }
]

export const channelOptions = [
  {
    label: '原创',
    value: 10,
    tag: 'primary'
  },
  {
    label: '女性向',
    value: 11,
    tag: 'primary'
  },
  {
    label: '同人',
    value: 12,
    tag: 'primary'
  },
  {
    label: '日轻',
    value: 13,
    tag: 'primary'
  }
]

export const needPayOptions = [
  {
    label: '免费',
    value: 0,
    tag: 'info'
  },
  {
    label: '付费',
    value: 1,
    tag: 'success'
  }
]

export const endOptions = [
  {
    label: '连载',
    value: 0,
    tag: 'warning'
  },
  {
    label: '完结',
    value: 1,
    tag: 'warning'
  }
]

export const blackRankOptions = [
  {
    label: '下榜',
    value: 1
  },
  {
    label: '未下榜',
    value: 0
  }
]

export const groupOptions = Array.from({ length: 8 }).map((v, i) => ({ label: i + 1 + '', value: i + 1 + '' }))

export const buyTypes = [
  {
    label: '按章购买',
    value: 0
  },
  {
    label: '按卷购买',
    value: 1
  }
]

export const orderOptions = [
  {
    label: '更新日期',
    value: '0'
  },
  {
    label: '字数',
    value: '5'
  },
  {
    label: '战力',
    value: '1'
  },
  {
    label: '信仰',
    value: '2'
  },
  {
    label: '收藏',
    value: '3'
  },
  {
    label: '评论数',
    value: '4'
  }
]

export const sortOptions = [
  {
    label: '降序',
    value: '-'
  },
  {
    label: '升序',
    value: ''
  }
]

export const chapterStatus = [
  {
    label: '草稿',
    value: 0,
    tag: 'info'
  },
  {
    label: '已通过',
    value: 2,
    tag: 'success'
  },
  {
    label: '审核中',
    value: 3,
    tag: 'warning'
  },
  {
    label: '未通过',
    value: 4,
    tag: 'info'
  },
  {
    label: '已退回',
    value: 7,
    tag: 'danger'
  }
]

export const chapterType = [
  {
    label: '设定章节',
    value: 0,
    tag: 'info'
  },
  {
    label: '免费章节',
    value: 1,
    tag: 'success'
  },
  {
    label: '付费章节',
    value: 2,
    tag: 'warning'
  }
]
