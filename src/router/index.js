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
        component: () => import('@/views/home/')
      },
      {
        path: '/article',
        name: 'article',
        component: () => import('@/views/article/')
      },
      {
        path: '/publish',
        name: 'publish',
        component: () => import('@/views/publish/')
      },
      {
        path: '/image',
        name: 'image',
        component: () => import('@/views/image/')
      },
      {
        path: '/comment',
        name: 'comment',
        component: () => import('@/views/comment/')
      },
      {
        path: '/setting',
        name: 'setting',
        component: () => import('@/views/setting/')
      },
      {
        path: '/fans',
        name: 'fans',
        component: () => import('@/views/fans')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
const user = window.localStorage.getItem('user')
// 配置路由导航守卫
router.beforeEach((to, from, next) => {
  // 判断是否为登录登录界面
  if (to.path !== '/login') {
    // 判断是否已经登录，如果已经登录，直接放行
    if (user) {
      next()
    } else {
      next('/login')
    }
    // 如果没有登录就跳转到登录界面
  } else {
    // 是登录界面直接放行
    next()
  }
})
// 这里暴露的router就是我们组件中直接使用的$router 我们可以在非组件的文件中单独引入就可以调用router相关的方法了
export default router
