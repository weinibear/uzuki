<template>
  <div class="ui-test">
    <section class="uploader-wrapper">
      <label
        class="uploader"
        :class="{ 'inapp': form.app }"
        :style="{ width, height}"
        @dragover="dragover"
        @drop="drop">
        <template v-if="url">
          <div class="preview"
            :style="{
              backgroundImage: 'url(' + url + ')',
              backgroundSize: form.size,
              backgroundPosition: form.position
          }"></div>
        </template>
        <span v-else>将图片拖到此处或点击上传预览</span>
        <span v-if="form.app" class="app-tip">我是APP上面的那些鬼东西</span>
        <input @change="change" type="file" style="display:none">
      </label>
    </section>
    <section class="controll">
      <el-form label-width="100px">
        <el-form-item label="分辨率">
          <el-select v-model="form.ratio">
            <el-option
              v-for="item in ratios"
              :key="item"
              :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="填充方式">
          <el-select v-model="form.size">
            <el-option
              v-for="item in sizes"
              :key="item"
              :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位置">
          <el-select v-model="form.position">
            <el-option
              v-for="item in positions"
              :key="item"
              :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="app">
          <el-switch
            v-model="form.app"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    const ratios = [
      '414/736 (iPhone6/7/8 Plus 16:9)',
      '400/640 (Nexus10 16:10)',
      '375/812 (iPhoneX)',
      '360/480 (iPad 4:3 参考)'
    ]
    return {
      url: '',
      form: {
        ratio: ratios[0],
        size: 'cover',
        position: 'center',
        app: true
      },
      sizes: ['cover', 'contain', '100% 100%', 'auto'],
      positions: ['top', 'center', 'bottom'],
      ratios
    }
  },
  computed: {
    width () {
      return this.form.ratio.replace(/\/.*$/, '').trim() + 'px'
    },
    height () {
      const height = this.form.ratio.replace(/^\d+\/|\(.*\)/g, '').trim() + 'px'
      return height
    }
  },
  methods: {
    dragover (e) {
      e.preventDefault()
    },
    drop (e) {
      e.preventDefault()
      this.read(e.dataTransfer.files)
    },
    change (e) {
      const files = e.target.files
      this.read(files).finally(() => {
        e.target.value = ''
      })
    },
    read (files) {
      return new Promise((resolve, reject) => {
        if (!files || files.length === 0) {
          resolve()
          return
        }
        const file = files[0]
        if (/^image\/\w+$/.test(file.type)) {
          const reader = new FileReader()
          reader.onload = () => {
            this.url = reader.result
            resolve()
          }
          reader.onerror = reject
          reader.onabort = reject
          reader.readAsDataURL(file)
        } else {
          const err = new Error()
          err.message = '请选择图片格式文件'
          reject(err)
        }
      }).catch(err => {
        this.$message.error(err && err.message ? err.message : err)
        throw err
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/style/var';
.ui-test {
  padding: 30px;
  display: flex;
  overflow: auto;
  background: #fff;
}
.uploader-wrapper {

  width: 500px;
}
.controll {
  width: 500px;
}
.uploader {
  position: relative;
  width: 375px;
  height: 667px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba($color: #000000, $alpha: 0.5);
  &:hover {
    border-color: mix(#fff, $--color-primary, 30%);
    color: mix(#fff, $--color-primary, 30%);
  }
}

.inapp {
  padding-top: 80px;
}
.app-tip {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  line-height: 80px;
  text-align: center;
  border-bottom: 1px dashed #d9d9d9;
  color: #888;
}

.preview {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: 0 -1px 2px rgba($color: #000000, $alpha: 0.2);
}
</style>
