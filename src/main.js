import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.less'

Vue.config.productionTip = false

// 创建Vue根实例
// 把router配置到根实例中
// 通过 render 方法把 根组件 App 渲染到 #app入口节点
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
