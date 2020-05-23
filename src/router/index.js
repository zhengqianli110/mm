import Vue from 'vue'
// 下载  导入路由
import VueRouter from 'vue-router'
// 注册路由
Vue.use(VueRouter)

// 导入token 按需导出 这个gettoken 获得token
import {
    getToken
} from "@/utils/token";

// 导入路由组件 
import Layout from '@/views/layout/index.vue'
import Login from '@/views/login/index.vue'
import Chart from "@/views/layout/chart"
import User from "@/views/layout/user"
import Enterprise from "@/views/layout/enterprise"
import Question from "@/views/layout/question"
import Subject from "@/views/layout/subject"

// 案例 test里面的测试路由
import Parent from '@/test/parent-child-broble/parent.vue'
// 实例化
const router = new VueRouter({
    routes: [
        // 测试路由
        {
            path: '/parent',
            component: Parent
        },

        {
            // 重定向
            path: '/',
            redirect: '/login'
        },
        {
            path: '/layout',
            component: Layout,
            // 嵌套路由 
            children: [{
                    path: 'chart',
                    component: Chart,
                },
                {
                    path: 'user',
                    component: User,
                },
                {
                    path: 'enterprise',
                    component: Enterprise,
                },
                {
                    path: 'question',
                    component: Question,
                },
                {
                    path: 'subject',
                    component: Subject,
                },

            ]
        },
        {
            path: '/login',
            component: Login
        }
    ]
})


// 导航守卫  每个路由跳转都要拦截 判断是否有token
router.beforeEach((to, from, next) => {
    // console.log('to------', to);
    // console.log('from------', from);
    // next()
    // 判断你要访问 登陆页面就让你去 否则你要访问登陆后的页面就判断你有没有token
    if (to.fullPath == '/login') {
        next()
    } else {
        const token = getToken()
        if (token) { //代表登陆了
            next() // 你想去的页面
        } else {
            next('/login')
        }
    }
})

// 导出
export default router