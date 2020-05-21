import Vue from 'vue'

import axios from 'axios'

// 设置基础路径
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
// 允许携带cookies
axios.defaults.withCredentials = true;

// 请求拦截器  每个请求都在这里判断 并带上token
import {
    getToken
} from "@/utils/token";
import {
    removeToken
} from "@/utils/token";
// 导入路由
import router from '@/router'
// 请求拦截器发送请求就来到这里
axios.interceptors.request.use(function (config) {
    //在发送请求之前做某事
    const token = getToken()
    if (token) {
        config.headers.token = token
    }
    return config
}, function (error) {
    //请求错误时做些事
    return Promise.reject(error)
});

// 响应拦截器  想赢回来数据前 先到这里
// Add a response interceptor
axios.interceptors.response.use(function (response) {
    if (response.data.code === 206) {
        // 删除token
        removeToken()
        //    跳转  然后这是 js里面 this不是 vue中那个this了  这里 我们要把路由导进来 使用
        router.push('./login')
    }
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});
// 原型中写这个方法
Vue.prototype.$axios = axios;