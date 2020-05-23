<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="left">
        <i @click="isCollapse = !isCollapse" style="font-size: 20px;" class="el-icon-s-fold"></i>
        <img src="@/assets/layout_icon.png" class="marginlr" alt />
        <span class="title">黑马面面</span>
      </div>
      <div class="right">
        <img :src="avatar" alt />
        <span class="name">{{ username }} 欢迎您</span>
        <el-button @click="logout" type="primary">退出</el-button>
      </div>
    </el-header>

    <el-container>
      <el-aside width="auto">
        <!-- 添加 router 下面对对应的 index 就是路由地址了 -->
        <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          router
          :default-active="defaultActive"
        >
          <el-menu-item index="/layout/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据预览</span>
          </el-menu-item>

          <el-menu-item index="/layout/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>

          <el-menu-item index="/layout/enterprise">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>

          <el-menu-item index="/layout/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>

          <el-menu-item index="/layout/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 路由的嵌套 -->
      <el-main style="background-color:#e8e9ec;">
        <!-- 路由的嵌套  要在router里面 的index。js配置 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { removeToken } from "@/utils/token";
export default {
  data() {
    return {
      username: "", // 用户名
      avatar: "", // 用户头像
      isCollapse: false, // 控制左边栏的隐藏显示
      defaultActive: "" //  控制选中 高亮
    };
  },
  created() {
    // 进来能拿到路由
    // console.log(this.$route);
    // 赋值给 defaultActive这样他就选中了
    this.defaultActive = this.$route.fullPath;
    this.getinfo();
  },
  methods: {
    async getinfo() {
      const res = await this.$axios.get("/info");
      // console.log(res);
      // 进来就发请求 获取登陆的 用户名 和 头像  要带过去 token 我们在requse。js里面全局设置
      if (res.data.code == 200) {
        this.username = res.data.data.username;
        this.avatar = process.env.VUE_APP_BASEURL + "/" + res.data.data.avatar;
      }
    },
    // 退出的点击事件  点击弹出提示框 element-ui里面的
    //  删除token  跳转到主页
    logout() {
      this.$confirm("确定要退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.get("/logout");
          // console.log(res);
          if (res.data.code == 200) {
            // 删除 token
            removeToken();
            // 跳转
            this.$router.push("/login");
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less">
.layout {
  height: 100%;
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #f3f3f3;
    .left {
      display: flex;
      align-items: center;
      .marginlr {
        margin-left: 10px;
        margin-right: 10px;
      }
      .title {
        font-size: 22px;
        color: #49a1ff;
      }
    }
    .right {
      display: flex;
      align-items: center;
      img {
        width: 43px;
        height: 43px;
        margin-right: 9px;
        border-radius: 50%;
      }
      .name {
        margin-right: 38px;
      }
    }
  }
  .el-menu {
    border-right: solid 0px #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #fff;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
}
</style>