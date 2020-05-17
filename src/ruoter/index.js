import Vue from 'vue'
// 下载  导入路由
import VueRouter from 'vue-router'
// 注册路由
Vue.use(VueRouter)
// 导入路由组件 
import Layout from '@/views/layout/index.vue'
import Login from '@/views/login/index.vue'
// 实例化
const router = new VueRouter({
    routes: [{
            // 重定向
            path: '/',
            redirect: '/login'
        },
        {
            path: '/layout',
            component: Layout
        },
        {
            path: '/login',
            component: Login
        }
    ]
})
// 导出
export default router