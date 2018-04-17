
const useTypes = {
  bgp: {
    type: 'image',
    value: 0,
    name: '场景',
    category: 0
  },
  role: {
    type: 'image',
    value: 1,
    name: '角色',
    category: 1
  },
  item: {
    type: 'image',
    value: 3,
    name: '物件',
    category: 4
  },
  bgm: {
    type: 'sound',
    value: 0,
    name: '音乐',
    category: 2
  },
  bga: {
    type: 'sound',
    value: 1,
    name: '音效',
    category: 3
  },
  voice: {
    type: 'sound',
    value: 2,
    name: '语音',
    category: 5
  }
}

const picTypes = ['静态图', '纸娃娃', '差分图', '骨骼动画', 'Rule']

export { useTypes, picTypes }
