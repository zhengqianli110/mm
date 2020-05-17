<template>
  <div class="login-container">
    <div class="left">
      <div class="title-box">
        <img src="@/assets/login_icon.png" alt />
        <span class="title">黑马面面</span>
        <span class="line"></span>
        <span class="sub-title">用户登录</span>
      </div>
      <!-- form表单部分 -->
      <el-form :model="loginForm" :rules="rules" class="login-form" ref="loginFormRef">
        <el-form-item prop="phone">
          <el-input prefix-icon="el-icon-user" placeholder="请输入手机号" v-model="loginForm.phone"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="18">
            <el-col :span="16">
              <el-input v-model="loginForm.code" prefix-icon="el-icon-key" placeholder="请输入验证码"></el-input>
            </el-col>
            <el-col :span="8">
              <img class="captcha" :src="loginUrl" @click="getUrl" />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="isCheck">
          <el-checkbox v-model="loginForm.isCkeck"></el-checkbox>我已阅读并同意
          <el-link type="primary" href="http://www.baidu.com">用户协议</el-link>和
          <el-link type="primary" href="http://www.baidu.com">隐私条款</el-link>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" type="primary" @click="loginClick">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button style="width:100%" type="primary">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="right">
      <img src="@/assets/login_bg.png" alt />
    </div>
  </div>
</template>

<script>
import { setToken } from "@/utils/token";
export default {
  name: "Login", // 这写个名字 我们调试 什么的就能一下搜索定位到这里
  data() {
    return {
      loginUrl: process.env.VUE_APP_BASEURL + "/captcha?type=login",
      loginForm: {
        // 模型
        phone: "18511111111", // 手机号
        password: "12345678", // 密码
        code: "", // 验证码
        isCkeck: true //勾选的
      },
      rules: {
        // 校验规则 element-ui  里面的
        phone: [
          // 是个数组，代表这个里面可以写多个校验规则
          // { required: true, message: "必须输入手机号", trigger: "blur" },
          // { min: 11, max: 11, message: "手机号必须是11位", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("手机号不能为空"));
              }
              // 手机号的正则表达式
              const reg = /^1[3456789][0-9]{9}$/;
              if (!reg.test(value)) {
                return callback(new Error("手机号不合法"));
              }
              callback();
            },
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "必须输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur"
          }
        ],
        code: [
          { required: true, message: "必须输入验证码", trigger: "blur" },
          {
            min: 4,
            max: 4,
            message: "长度必须是4位",
            trigger: "blur"
          }
        ],
        isCkeck: [
          {
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error("必须勾选用户协议"));
              }
              callback();
            },
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    loginClick() {
      // 点击提交 效验 一下
      this.$refs.loginFormRef.validate(valid => {
        if (!valid) return;
        // 效验成功 请求
        this.$axios({
          method: "post",
          url: "/login",
          data: this.loginForm
        }).then(res => {
          // console.log(res.data);
          if (res.data.code == 200) {
            // 提示登陆成功
            this.$message({
              message: "恭喜你，登陆成功",
              type: "success"
            });
            // 保存token
            setToken(res.data.data.token);
            // 跳转到后台管理页面
            this.$router.push("/layout");
          } else {
            // 提示出错
            this.$message.error(res.data.message);
            // 吧验证码从新请求一下
            this.loginUrl =
              process.env.VUE_APP_BASEURL +
              "/captcha?type=login&r=" +
              Math.random();
          }
        });
      });
    },
    getUrl() {
      // 点击验证码图片 给他换下地址  要加随机数 要不他会请求缓存
      // 请求缓存 两个条件 一个是 url不变 一个是get请求
      // console.log(1111);
      this.loginUrl =
        process.env.VUE_APP_BASEURL + "/captcha?type=login&r=" + Math.random();
    }
  }
};
</script>

<style lang="less">
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: linear-gradient(225deg, #1493fa, #01c6fa);
  .left {
    width: 478px;
    height: 550px;
    background: #f5f5f5;
    padding: 48px;
    .title-box {
      display: flex;
      align-items: center;
      img {
        width: 22px;
        height: 17px;
        margin-right: 16px;
      }
      .title {
        font-size: 24px;
        margin-right: 14px;
      }
      .line {
        width: 1px;
        background-color: #c7c7c7;
        height: 27px;
        margin-right: 12px;
      }
      .sub-title {
        font-size: 22px;
      }
    }
    .login-form {
      margin-top: 29px;
      .captcha {
        width: 100%;
        height: 40px;
      }
    }
  }
}
</style>