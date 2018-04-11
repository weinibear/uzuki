
const useTypes = {
  bgp: {
    type: 'image',
    value: 0,
    name: '场景'
  },
  role: {
    type: 'image',
    value: 1,
    name: '角色'
  },
  item: {
    type: 'image',
    value: 3,
    name: '物件'
  },
  bgm: {
    type: 'sound',
    value: 0,
    name: '音乐'
  },
  bga: {
    type: 'sound',
    value: 1,
    name: '音效'
  },
  voice: {
    type: 'sound',
    value: 2,
    name: '语音'
  }
}

const picTypes = ['静态图', '纸娃娃', '差分图', '骨骼动画', 'Rule']

export { useTypes, picTypes }
