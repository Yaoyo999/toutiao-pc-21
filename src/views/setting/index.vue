<template>
  <div class="setting-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>个人设置</el-breadcrumb-item>
    </el-breadcrumb>
     </div>
     <!-- 个人信息 -->
     <el-form ref="settingform" :model="userForm" :rules="profileRules" label-width="100px" class="form-container">
  <el-row>
    <el-col :span="12">
      <div>
    <el-form-item label="编号：" v-model="userForm.id">
    <span>1</span>
  </el-form-item>
  <el-form-item label="手机：" v-model="userForm.mobile">
    <span>13911111111</span>
  </el-form-item>
  <el-form-item label="媒体名称" prop="name">
    <el-input v-model="userForm.name"></el-input>
  </el-form-item>
  <el-form-item label="媒体介绍" prop="intro">
    <el-input type="textarea" v-model="userForm.intro"></el-input>
  </el-form-item>
  <el-form-item label="邮箱" prop="email">
    <el-input v-model="userForm.email"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onSendInfo" :loading="loading">保存设置</el-button>
  </el-form-item>
  </div>
    </el-col>
    <el-col :span="6">
      <div @click="$refs.avatorFile.click()" class="container">
      <img :src="userForm.photo" alt="avator" class="avator">
      <p>更换头像</p>
      <!-- change事件监听是否选择了文件 使用ref然后找到input调用click事件触发，或者用label的for属性和input的id来触发input-->
      <input type="file" class="filebutton" ref="avatorFile" @change="onFileChange">
  </div>
    </el-col>
  </el-row>
  <!-- 头像弹出框 -->
  <el-dialog
  title="图片预览"
  append-to-body
  :visible.sync="dialogVisible"
  width="40%"
  @opened="onDiagopened"
  >
  <div class="preview-container">
    <img :src="previewData" class="preview"  ref="previewAvator" />
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateUserAvator" :loading="diagLoading">确 定</el-button>
  </span>
</el-dialog>
</el-form>
</el-card>
  </div>
</template>

<script>
import { getUserInfo, editUserInfo, uploadUserAvator } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import global from '@/utils/global-bus'
export default {
  name: 'settingIndex',
  components: {},
  props: {},
  data () {
    return {
      userForm: {
        name: '',
        email: '',
        id: 1,
        intro: '',
        mobile: '',
        photo: ''
      },
      profileRules: {
        name: [
          { required: true, message: '媒体名称不能为空', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '媒体介绍不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          {
            validator: function (rule, value, callback) {
              var partern = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
              // console.log(partern.test(value))
              if (!partern.test(value)) {
                callback(new Error('请输入符合规则的邮箱'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      loading: false, // 按钮加载状态
      dialogVisible: false, // 控制弹出框的显示和隐藏状态
      previewData: '', // 预览图片的地址(blob)
      cropper: null, // 实例对象，方便其他方法使用
      diagLoading: false // 弹出框的loading状态
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUserInfo()
  },
  mounted () {},
  methods: {
    // 获取用户资料
    loadUserInfo () {
      getUserInfo().then(res => {
        this.userForm = res.data.data
      })
    },
    // 修改用户资料
    onSendInfo () {
      this.loading = true
      // 手动验证是否符合要求，符合发送请求，不符合提示
      // 获取到表单
      this.$refs.settingform.validate(valid => {
        if (!valid) {
          return false
        } else {
          editUserInfo(this.userForm).then(res => {
            this.$message({
              message: '修改资料成功',
              type: 'success'
            })
            global.$emit('updateUser', this.userForm)
            this.loading = false
            // console.log(this.userForm)
          }).catch(error => {
            console.log(error)
            this.$message({
              message: '修改用户资料失败',
              type: 'error'
            })
            this.loading = false
          })
        }
      })
    },
    // 当文件选择时调用函数修改用户头像
    onFileChange () {
      // 弹出预览框
      this.dialogVisible = true
      // 点击确定文件之后的值
      const file = this.$refs.avatorFile.files[0]
      // 将图片转为blob数据用于图片预览 src可以直接显示blob数据
      // previewData = blob:http://localhost:8080/7acfa45c-3e22-4ca4-b04f-29e257a4a04c
      this.previewData = window.URL.createObjectURL(file)
      // console.log(this.previewData)
      // console.log(file)
      // if (file) {
      //   const fd = new FormData()
      //   fd.append('photo', file)
      //   uploadUserAvator(fd).then(res => {
      //   // 重新获取数据（刷新）
      //     this.loadUserInfo()
      //     // console.log(res)
      //     this.$message({
      //       message: '更换成功，请点击保存设置',
      //       type: 'success'
      //     })
      //   }).catch(error => {
      //     console.log(error)
      //     this.$message({
      //       message: '修改头像失败',
      //       type: 'error'
      //     })
      //   })
      // }
      // 解决选择相同文件change事件不触发的问题每次选择后将input的文件的值清空
      this.$refs.avatorFile.value = ''
    },
    // 当对话框的动画结束时图片显示出来此时创建cropper实例
    onDiagopened () {
      // 获取到预览的image
      const previewImage = this.$refs.previewAvator
      // 解决预览图片下次还是上次预览的图片的问题
      // 判断是否存在cropper示例，有就替换成新的文件路劲没有就创建或者调用destroy方法销毁下次直接创建新的
      if (this.cropper) {
        this.cropper.replace(this.previewData)
        return
      }
      // 创建cropper实例
      this.cropper = new Cropper(previewImage, {
        viewMode: 1,
        aspectRatio: 1,
        background: false,
        dragMode: 'none'
      })
    },
    // 点击修改头像
    updateUserAvator () {
      this.diagLoading = true
      // 点击确定调用api裁切获取到裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        // 封装FormData 发送请求的headers的Content-Type需要
        const fd = new FormData()
        fd.append('photo', file)
        // 发送请求修改头像
        uploadUserAvator(fd).then(res => {
          // 关闭弹出框的按钮
          this.diagLoading = false
          // 关闭弹出层
          this.dialogVisible = false
          // 更新视图
          this.userForm.photo = window.URL.createObjectURL(file)
          // 同步用户头像的展示
          global.$emit('updateUser', this.userForm)
          // console.log(this.previewData)
          // 这样获取太慢了要等数据回来在显示我们用上面的方法直接装为blob展示到页面中
          // this.userForm.photo = res.data.data.photo
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  .el-form-item {
    min-width: 400px;
    max-width: 650px;
}
.filebutton {
  display: none;
}
.preview-container {
  .preview {
    display: block;
    max-width: 100%;
  }
}
.container {
  margin-left: 40px;
  .avator {
    width: 150px;
  }
}
</style>
