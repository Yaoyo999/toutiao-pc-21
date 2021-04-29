<template>
  <div class="imageList">
    <!-- 按钮区域 -->
<div class="active-head" v-if="isShowActiveHead">
      <el-radio-group v-model="collect" size="mini" @change="toggleCollect">
      <el-radio-button :label="false">全部</el-radio-button>
      <el-radio-button :label="true">收藏</el-radio-button>
    </el-radio-group>
    <el-button type="success" size="mini" @click="dialogImageVisible = true">添加素材</el-button>
</div>
<!-- 素材区域 -->
<el-row :gutter="20">
  <el-col :xs="12" :sm="6" :md="6" :lg="4" v-for="(image,index) in images" :key="index">
    <div class="image-wrap">
      <el-image
      style="width: 100px; height: 100px"
      :src="image.url"
      fit="cover"
      @click="select = index"
      >
    </el-image>
       <div class="icon-container" v-if="isShowIcon">
      <el-button
      class="addImage"
      :loading="image.loading"
      size="mini"
      :class="{
        'el-icon-star-off': !image.is_collected,
        'el-icon-star-on': image.is_collected
        }"
        @click="collectImage(image)"></el-button>
      <el-button
      :loading="imageLoading" sizi="mini" class="el-icon-delete addImage" @click="deleteCurrentImage(image.id)"></el-button>
    </div>
    <div :class="{ select: select === index}" v-if="isShowSelect">
    </div>
    </div>
</el-col>
</el-row>
<!-- 分页器 -->
<el-pagination
class="pagination"
background
layout="prev, pager, next"
:current-page="page"
:page-size.sync="pageSize"
:total="totalCount"
@current-change="currentImageChange"
>
</el-pagination>
<!-- 素材弹出框 -->
<!-- 该上传组件默认是post方式，因为是组件自己内部发送请求不走我们的请求配置，我们需要根据属性自己配置
Content-Type multipart/form-data 文件上传组件默认的 v-if使组件重新渲染销毁,使其提示文字在下次上传时不留在组件中
获取使用组件自带的属性 :show-file-list="false"-->
<el-dialog title="上传素材" :visible.sync="dialogImageVisible" :append-to-body="true">
<el-upload
  v-if="dialogImageVisible"
  class="upload-demo"
  drag
  action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
  multiple
  name="image"
  :headers="imageHeaders"
  :on-success="uploadSuccessImages"
  :on-error="uploadErrorImages"
  >
  <i class="el-icon-upload"></i>
  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
</el-upload>
</el-dialog>
  </div>
</template>
<script>
import { getImages, addCollectImage, deleteImage } from '@/api/image'
export default {
  name: 'imageIndex',
  components: {},
  props: {
    isShowActiveHead: {
      type: Boolean,
      default: true
    },
    isShowIcon: {
      type: Boolean,
      default: true
    },
    isShowSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: false,
      images: [], // 素材数据列表
      dialogImageVisible: false, // 素材选择弹出框
      imageHeaders: {
        Authorization: `Bearer ${user.token}`
      }, // headers参数对象
      totalCount: 0, // image的总数目
      pageSize: 20, // 每页展示的图片
      page: 1, // 当前的页码
      imageLoading: false, // loading状态
      select: null // selcet的初始值，都不选中
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadImages(1)
  },
  mounted () {},
  methods: {
    // 获取图片素材
    loadImages (page) {
      // 同步分页器中的页码
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        // 给每个image对象添加一个loading属性，使每个对象都有loding而不是公用
        const results = res.data.data.results
        results.forEach(img => {
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    // 切换全部和收藏
    toggleCollect () {
      this.loadImages(1)
    },
    // 上传成功图片更新视图
    uploadSuccessImages () {
      this.$message({
        type: 'success',
        message: '上传素材成功'
      })
      // 关闭选择素材的弹出框
      this.dialogImageVisible = false
      // 更新获取图片
      this.loadImages(this.page)
    },
    // 上传失败
    uploadErrorImages () {
      // 关闭选择素材的弹出框
      this.dialogImageVisible = false
      // 提示用户
      this.$message({
        message: '上传文件失败,请稍后再试',
        type: 'error'
      })
    },
    // 获取当前页的图片
    currentImageChange (page) {
      this.page = page
      this.loadImages(this.page)
    },
    // 收藏图片素材
    collectImage (image) {
      // 按钮禁用
      image.loading = true
      addCollectImage(image.id, !image.is_collected).then(res => {
        image.is_collected = !image.is_collected
        if (image.is_collected) {
          this.$message({
            message: '收藏成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '取消收藏成功',
            type: 'success'
          })
        }
        // 调用更新视图
        this.loadImages(this.page)
        image.loading = false
      })
    },
    // 删除图片素材
    deleteCurrentImage (imageId) {
      this.$confirm('确定要删除改图片素材吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除文章
        deleteImage(imageId)
        // 更新列表
        this.loadImages(this.page)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.imageLoading = false
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.active-head {
    display: flex;
    justify-content: space-between;
    padding-top: 10px;
    padding-bottom: 30px;
}
.upload-demo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.icon-container {
  position: absolute;
  top: 60px;
  height: 34px;
  width: 100px;
  // background-color: rgba(0, 0, 0, .6);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.el-icon-star-on{
  color: rgb(64,158,255);
  font-size: 20px;
}
.el-icon-star-off, .el-icon-delete {
    font-size: 20px;
}
.addImage {
 padding: 0;
 background: transparent;
 border: none;
}
.pagination {
  padding-top: 15px;
}
.image-wrap {
  position: relative;
  .select {
  position: absolute;
  overflow: hidden;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: url('./selected.png') no-repeat;
  background-size: 100px 100px;
}
}
</style>
