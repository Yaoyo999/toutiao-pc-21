<template>
  <el-container class="layout-container">
    <el-aside :width="collapse ? 'auto' : '180px'" class="aside">
      <app-nav :collapse="collapse"></app-nav>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i
          :class="{
            'el-icon-s-fold': collapse,
            'el-icon-s-unfold':!collapse
          }"
          @click="collapse = !collapse"
          ></i>
          <span>江苏传智播客科技教育有限公司</span>
        </div>
        <el-dropdown>
        <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt="">
            <span>{{user.name}}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import appNav from './conponents/appNav'
import { userProfile } from '@/api/user'
import global from '@/utils/global-bus'
export default {
  name: 'layoutIndex',
  components: {
    appNav
  },
  props: {},
  data () {
    return {
      user: {}, // 当前登录对象
      collapse: false // 是否菜单栏折叠，默认不折叠
    }
  },
  computed: {},
  watch: {},
  created () {
    // 初始化完成就发送请求调用
    this.loadUserProfile()
    global.$on('updateUser', (data) => {
      // 注意这里不是直接将data 赋值给user 因为是对象，引用数据类型
      // 如果直接传递会使数据同步，造成数据污染
      this.user.photo = data.photo
      this.user.name = data.name
      // console.log(data)
    })
  },
  mounted () {},
  methods: {
    // 获取用户信息
    loadUserProfile () {
      userProfile().then(res => {
        this.user = res.data.data
      })
    },
    // 退出登录
    logOut () {
      this.$confirm('确定要退出登录吗', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'waring'
      }).then(() => {
        // 清除用户登录信息
        window.localStorage.removeItem('user')
        // 退出登录，退回到登录界面
        this.$router.replace('/login')
      })
    }
  }
}
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  background-color: rgb(211, 220, 230);
  .el-menu {
    height: 100%;
  }
}
.header {
  background-color:#fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  .el-icon-s-fold,.el-icon-s-unfold {
      margin-right: 4px;
  }
  .avatar-wrap{
      display: flex;
      align-items: center;
      .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin-right: 10px;
      }
  }
}
.main {
  background-color: rgb(233, 238, 243);
}
</style>
