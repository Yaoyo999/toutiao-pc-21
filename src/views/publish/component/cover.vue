<template>
  <div class="cover-container">
    <div class="imageWrap">
    <div class="cover-wrap" @click="dialogVisible = true">
      <img class="cover" ref="cover" :src="value"/>
    </div>
    </div>
    <el-dialog
    title="选择封面"
    append-to-body
    :visible.sync="dialogVisible"
    width="50%"
    >
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="素材上传" name="first">
        <image-list :isShowActiveHead="false" :isShowIcon="false" :isShowSelect="true" ref="imageList"></image-list>
      </el-tab-pane>
      <el-tab-pane label="本地上传" name="second" class="backgroundWrap">
        <div class="background" @click="uploadImage" v-if="!files">
          <span>点击上传图片</span>
          <i class="el-icon-upload"></i>
        </div>
      <input type="file" ref="uploadFile" @change="choiceCover" class="uploadinput">
      <!-- 预览图片 -->
      <img ref="previewCover" />
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="uploadCover" :loading="dialogLoading">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import { uploadImage } from '@/api/articles.js'
import ImageList from '../../../components/image-list.vue'
export default {
  name: 'coverIndex',
  components: {
    ImageList
  },
  props: {
    // coverImage: {
    //   isRequired: true,
    //   type: String
    // }
    value: {
      type: [String, null, undefined],
      isRequired: true
    }
  },
  data () {
    return {
      dialogVisible: false, // 弹出框的状态
      activeName: 'second', // 被选中的tab栏
      dialogLoading: false, // 弹层的禁止状态
      files: null
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    choiceCover () {
      // 获取到文件对象的值
      const file = this.$refs.uploadFile.files[0]
      this.files = file
      // 将图片转为blob预览
      const blob = window.URL.createObjectURL(file)
      this.$refs.previewCover.src = blob
      // console.log(file)
      // 将上次选择文件清空
      // this.$refs.uploadFile.value = ''
    },
    // 点击上传图片从后台返回在线地址展示到组件中随其他一起提交展示
    uploadCover () {
      // 判断是不是处于上传图片的情况下，如果是执行下面的操作
      if (this.activeName === 'second') {
        // 选择的值
        const file = this.$refs.uploadFile.files[0]
        if (!file) {
          return
        }
        this.dialogVisible = true
        const blob = window.URL.createObjectURL(file)
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          // 将返回的在线图片地址值展示在Cover组件中
          this.$refs.cover.src = blob
          // 将数据传递给父组件
          // this.$emit('coverUrl', res.data.data.url)
          this.$emit('input', res.data.data.url)
          // 关闭弹层
          this.dialogVisible = false
          this.dialogLoading = false
        })
      } else if (this.activeName === 'first') {
        // 获取image-list中的数据 ref有两个用处
        // 1.获取组件中的html元素
        // 2.获取组件示例拿子组件的数据
        const imageList = this.$refs.imageList
        const select = imageList.select
        // 判断是否选择图片通过获取到的select来看 没选择图片selcet等于null
        if (select === null) {
          return
        }
        // 关闭弹出层
        this.dialogVisible = false
        // 获取选择的图片传递给父组件数据
        this.$emit('input', imageList.images[select].url)
        // 将上次选择文件清空
        this.$refs.uploadFile.value = ''
      }
    },
    // 点击触发input上传图片
    uploadImage () {
      this.$refs.uploadFile.click()
    }
  }
}
</script>

<style scoped lang="less">
.imageWrap {
  border: 1px solid #fff;
  float: left;
  .cover-wrap {
  width: 150px;
  height: 135px;
  overflow: hidden;
  // border: 1px solid #000;
  float: left;
  margin-right: 12px;
  background: url('./upload.jpg');
  background-size: cover;
  .cover {
    width: 150px;
    height: 135px;
  }
}
}
.backgroundWrap {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .uploadinput{
    display: none;
  }
  .background {
 width: 200px;
 height: 200px;
//  background-color: yellow;
 box-sizing: border-box;
 display: flex;
 flex-direction: column;
 justify-content: center;
 align-items: center;
 .el-icon-upload {
  font-size: 150px;
  color: yellowgreen;
 }
}
}

</style>
