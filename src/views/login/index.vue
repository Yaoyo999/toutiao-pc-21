<template>
  <div class="login-container">
    <div class="login-header-container">
         <div class="login-header"></div>
    </div>
    <el-form  :model="user" class="formClass" :rules="formRules" ref="login-form">
  <el-form-item prop="mobile">
    <el-input v-model="user.mobile" placeholder="请输入用户名"></el-input>
  </el-form-item>
  <el-form-item prop="code">
    <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
  </el-form-item>
  <el-form-item>
     <el-checkbox v-model="checked"/> <span class="textClass">我已阅读并同意用户协议和隐私条款</span>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="onLogin" class="btnClass" :loading="loginLoading">{{loginLoading ? '登录中':'登录'}}</el-button>
  </el-form-item>
</el-form>
  </div>
</template>
<script>
import { login } from '@/api/user.js'
export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '', // 用户名
        code: '246810' // 验证码
      },
      checked: false,
      loginLoading: false, // 登录加载状态，防止用户网络慢多次点击
      formRules: {
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入合法的手机号', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入6为验证码', trigger: 'change' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  methods: {
    onLogin () {
      // 获取表单数据对象
      this.$refs['login-form'].validate(valid => {
        // 如果表单验证不通过就返回，不在继续向下执行
        if (!valid) {
          return
        }
        // 表单通过验证发送请求登录
        this.login()
      })
    },
    login () {
      if (this.checked) {
        this.loginLoading = true
        // 得到表单数据
        const user = this.user
        login(user).then(res => {
          // 登录成功提示消息
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          // 将用户的token存储到本地
          window.localStorage.setItem('user', JSON.stringify(res.data.data))
          this.loginLoading = false
          // 跳转到主页(两种写法都可以)
          // this.$router.push('/')
          this.$router.replace({
            name: 'home'
          })
        }).catch(err => {
          this.$message.error('登录失败，手机号或验证码错误')
          this.loginLoading = false
          throw err
        })
      } else {
        this.$msgbox({
          title: '友情提示',
          message: '请确认是否同意勾选用户协议和隐私政策'
        }).then(res => {
          this.checked = true
        })
      }
    }
  }
}
</script>
<style scoped lang='less'>
.login-container{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url('./login_bg.jpg') no-repeat;
    background-size: cover;
    .formClass{
        background-color: #fff;
        padding:0px 50px 50px 50px;
        min-width: 300px;
    }
    .btnClass{
        width: 100%;
    }
    .login-header-container {
        padding: 20px 50px;
        text-align: center;
        width: 300px;
        background-color: #fff;
        .login-header{
        height: 57px;
        width: 259px;
        background: url('./logo_index.png');
    }
    }
    .textClass{
        color: #ccc;
        font-size: 12px;
        letter-spacing: 1px;
    }
}
// eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTg5MDkxMjYsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.EdKErKDqMc3snkYxqt02jSa8t9G44002yWKY3CMOMJg
</style>
