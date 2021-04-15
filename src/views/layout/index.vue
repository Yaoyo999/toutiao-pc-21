<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="aside">
      <app-nav></app-nav>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i class="el-icon-s-fold"></i>
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
            <el-dropdown-item>退出</el-dropdown-item>
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
export default {
  name: 'layoutIndex',
  components: {
    appNav
  },
  props: {},
  data () {
    return {
      user: {} // 当前登录对象
    }
  },
  computed: {},
  watch: {},
  created () {
    // 初始化完成就发送请求调用
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    loadUserProfile () {
      userProfile().then(res => {
        this.user = res.data.data
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
  .el-icon-s-fold {
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
