<template>
  <el-dialog
    title="预览演绘"
    width="1320px"
    top="2vh"
    :visible.sync="visible">
    <div class="preview-stage">
      <div id="preview-stage"
        style="width: 1280px; height: 720px"
        class="egret-player"
        data-entry-class="Main"
        data-orientation="landscape"
        data-scale-mode="showAll"
        data-frame-rate="60"
        data-content-width="1280"
        data-content-height="720"
        data-show-paint-rect="false"
        data-multi-fingered="2"
        data-show-fps="false"
        data-show-log="false"
        data-show-fps-style="x:0,y:0,size:12,textColor:0xffffff,bgAlpha:0.9"
      >
      </div>
    </div>
    <div slot="footer">
      <el-button @click="showiqatool">启用引擎菜单</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getChapterContent, getChapterDraftContent } from '@/api/yanhui/game'
import { loadScript } from '@/utils'

const parseRes = (data) => {
  const result = {
    groups: [],
    resources: []
  }
  const keys = []
  Object.keys(data).forEach(key => {
    const list = data[key]
    let type = 'image'
    if (key === 'bga' || key === 'bgm' || key === 'voice') {
      type = 'sound'
    }
    list.forEach(item => {
      result.resources.push({
        type,
        name: item.name,
        url: item.link
      })
      keys.push(item.name)
    })
  })
  result.groups.push({
    name: 'gameres',
    keys
  })
  return result
}

export default {
  props: {
    draft: {
      type: Boolean,
      default: false
    },
    id: {}
  },
  data () {
    return {
      visible: false
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.open()
      } else {
        this.close()
      }
    }
  },
  methods: {
    getData () {
      return this.draft ? getChapterDraftContent(this.id) : getChapterContent(this.id)
    },
    loadScript () {
      const time = Date.now() / 18000000 | 0
      return loadScript('https://menma.iqing.com/static/iqa/iqalibs.js').then(() => {
        return loadScript(`https://menma.iqing.com/static/iqa/iqa.min.js?t=${time}`)
      })
    },
    showiqatool () {
      if (window.iqa) {
        window.iqa.root.scene.gamestage.sevent.renderBtn()
      }
    },
    open () {
      this.loadScript()
        .then(this.getData)
        .then(data => {
          const resJson = parseRes(JSON.parse(data.material))
          if (data.type === 1) {
            let json = JSON.parse(data.scene)
            data.script = window.iqa.trans(json)
          }
          const obj = {
            res: JSON.stringify(resJson),
            script: data.script
          }
          if (this.visible) {
            window.iqa.preview(obj)
          }
        })
    },
    close () {
      if (window.iqa && window.iqa['preview_pause']) {
        window.iqa['preview_pause']()
      }
    }
  }
}
</script>
