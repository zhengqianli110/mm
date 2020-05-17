import Vue from 'vue'
import App from './App.vue'


Vue.config.productionTip = false

// 导入路由
import router from './ruoter/index.js'
// 导入 element-ui
import '@/plugins/element.js'
// 导入 axios
import '@/utils/request.js'

new Vue({
  render: h => h(App),
  // 挂载路由
  router
}).$mount('#app')