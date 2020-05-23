<template>
  <div class="user">
    <!-- 搜索部分 -->
    <el-card>
      <el-form inline :model="searchForm" ref="searchFormRef" label-width="80px">
        <el-form-item label="用户名称" prop="username">
          <el-input style="width:150px;" v-model="searchForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input style="width:200px;" v-model="searchForm.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id">
          <el-select style="width:200px;" v-model="searchForm.role_id" placeholder="请选择">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clear" type="default">清除</el-button>
          <el-button type="primary" @click="adduser">+新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容部分 -->
    <el-card style="margin-top:20px;">
      <el-table :data="userlist" style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <!-- 自定义 作用域插槽   scope.row相当于 userlist-->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0 " style="color:red">禁用</span>
            <span v-else style="color:green">启动</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-button type="primary" @click="updata(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus(scope.row.id)"
              :type="scope.row.status===0 ? 'success':'info'"
            >{{scope.row.status===0 ? '启动':'禁用'}}</el-button>
            <el-button type="default" @click="delList(scope.row.id,scope.row.username)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="text-align: center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[2, 5, 10]"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <addUpdata ref="addOrUp"></addUpdata>
  </div>
</template>

<script>
// 导入子组件
import addUpdata from "@/views/layout/user/add-updata";
export default {
  name: "UserList",
  // 注册组件
  components: { addUpdata },
  data() {
    return {
      searchForm: {
        username: "", // 昵称
        email: "", // 邮箱
        role_id: "" // 角色数字 1、超级管理员 2管理员、3老师、 4学生
      },
      page: 1, // 查询时候的页码
      limit: 2, // 查询时候的页容量(每页查询多少条)
      userlist: [],
      total: 0 // 总条数，分页时候用得着
    };
  },
  created() {
    this.getuserlist();
  },
  methods: {
    async getuserlist() {
      const res = await this.$axios.get("/user/list", {
        params: {
          page: this.page, //页码
          limit: this.limit, // 每页几个数据
          ...this.searchForm // es6语法 searchForm每一项
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.userlist = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 单独写个 seach 搜所的方法
    search() {
      // 从第一页开始搜 页码换成 第一页
      this.page = 1;
      // 调用这个 发送请求
      this.getuserlist();
    },
    // 点击清楚 发请求 空数据
    clear() {
      // Element-Ui  的一个form表单方法  注意要给 里面的元素 加 prop
      this.$refs.searchFormRef.resetFields();
      this.search();
    },
    // 分页  每页显示几条数据 改变时
    handleSizeChange(val) {
      // console.log(val);
      // 把 改变的每页显示几条 赋值给linit
      this.limit = val;
      // 代用搜素方法
      this.search();
    },
    // 点击第几个 当前页码 时
    handleCurrentChange(val) {
      this.page = val;
      this.getuserlist();
    },
    // 启用和禁用的  点击事件  点击控制禁用和启用 请求
    async changeStatus(id) {
      const res = await this.$axios.post("/user/status", { id });
      // 提示修改成功
      if (res.data.code === 200) {
        this.$message({
          message: "更改状态成功",
          type: "success"
        });
        // 调用 seach方法
        this.search();
      }
    },
    // 删除按钮点击事件  拿到这一项的id 和用户名  提示   发请求删除  清新 调用seach方法
    delList(id, user) {
      this.$confirm(`确定要删除${user}用户吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/user/remove", { id });
          if (res.data.code === 200) {
            // 提示删除成功
            this.$message({
              message: "删除成功",
              type: "success"
            });
            // 请求刷新  就是调用 seach方法
            this.search();
          }
        })
        .catch(() => {});
    },
    // 新增和编辑点击事件  弹框
    adduser() {
      // 每次打开 吧里面填的内容清空
      this.$refs.addOrUp.userForm = {
        username: "", // 用户名
        email: "", // 邮箱
        phone: "", // 手机号
        role_id: "", // 角色 1：超级管理员 2：管理员 3：老师 4：学生
        status: "", // 状态 1：启用 0：禁用
        remark: "" // 备注
      };
      // 控制弹窗
      this.$refs.addOrUp.dialogVisible = true;
      // 标识下两个按钮  来控制 公用的组件的标题 改变
      this.$refs.addOrUp.mode = "add";
      // 清空效验
      this.$nextTick(() => {
        // dialong中的form表单渲染完成之后，会自动调用 这个回调函数
        this.$refs.addOrUp.$refs.userEditFormRef.clearValidate();
      });
    },
    // 点击编辑按钮  复用的框 mode改一下  然后吧scope.row 拿到这一项的数据 赋值给表单显示出来
    updata(obj) {
      this.$refs.addOrUp.mode = "edit";
      // 深克隆  吧这个 对象赋值给子组件的 这个表单对象
      this.$refs.addOrUp.userForm = JSON.parse(JSON.stringify(obj));
      // 控制弹窗
      this.$refs.addOrUp.dialogVisible = true;
      // 清空效验
      this.$nextTick(() => {
        // dialong中的form表单渲染完成之后，会自动调用 这个回调函数
        this.$refs.addOrUp.$refs.userEditFormRef.clearValidate();
      });
    }
  }
};
</script>
<style>
</style>