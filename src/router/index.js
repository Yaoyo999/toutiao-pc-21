import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login/index.vue'
Vue.use(VueRouter)

// 路由配置信息
const routes = [
  {
    name: 'Login',
    path: '/login',
    component: Login
  },
  {
    // 有默认子路由的父路由没有必要取名字，否则会收到一个警告
    // name:'',
    path: '/',
    component: () => import('@/views/layout'),
    children: [
      {
        name: 'home',
        path: '', // 子路由的path为空表示默认的子路由
        component: () => import('@/views/home')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
