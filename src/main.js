import Vue from 'vue'
import App from './App.vue'
// import axios from 'axios'

Vue.config.productionTip = false

// 导入路由
import router from './ruoter/index.js'

new Vue({
  render: h => h(App),
  router
}).$mount('#app')