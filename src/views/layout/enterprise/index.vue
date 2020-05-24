<template>
  <div class="business">
    <el-card class="header">
      <el-form inline :model="searchForm" ref="enterprform" label-width="80px" class="searchForm">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="searchForm.eid" class="inputW"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="searchForm.name" class="inputW"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="searchForm.username" class="inputW"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="请选择状态" class="inputW">
            <el-option label="启用" value="1"></el-option>
            <el-option label="不启用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchEnterprise">搜索</el-button>
          <el-button type="default" @click="cleraform">清除</el-button>
          <el-button type="primary" @click="addEnterprise">+新添企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="margin-top:20px;">
      <el-table :data="enterpriseList" stripe style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="企业编号" prop="eid"></el-table-column>
        <el-table-column label="企业名称" prop="name"></el-table-column>
        <el-table-column label="创建者" prop="short_name"></el-table-column>
        <el-table-column label="创建日期" prop="create_time" width="200"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status === 0 ? 'red':'green'}"
            >{{scope.row.status === 0 ? '禁用 ': '启动'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="scope">
            <el-button type="primary" @click="updataEnterprise(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus(scope.row.id)"
              :type="scope.row.status === 0 ? 'success ': 'info'"
            >{{scope.row.status === 0 ? '启用 ': '禁用'}}</el-button>
            <el-button type="default" @click="defaultEnterprise(scope.row.id, scope.row.name)">删除</el-button>
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
    <addAndupdata ref="addAndupdata"></addAndupdata>
  </div>
</template>

<script>
import addAndupdata from "@/views/layout/enterprise/add-updata.vue";
export default {
  components: {
    addAndupdata
  },
  data() {
    return {
      searchForm: {
        eid: "", // 企业编号
        name: "", //企业名称
        username: "", // 创建者
        status: "" // 状态
      },
      enterpriseList: [],
      page: 1, // 查询时候的页码 当前页
      limit: 2, // 查询时候的页容量(每页查询多少条)
      total: 0 // 总条数，分页时候用得着
    };
  },
  created() {
    this.getEnterpriseForm();
  },
  methods: {
    // 企业列表 进来这个页面  发请求 拿到数据
    async getEnterpriseForm() {
      const res = await this.$axios.get("/enterprise/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
      });
      if (res.data.code == 200) {
        // console.log(res);
        this.enterpriseList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 点击搜索  事件
    searchEnterprise() {
      this.page = 1;
      this.getEnterpriseForm();
    },

    // 清除 点击事件
    cleraform() {
      // 调用element-ui 的resetFields() 方法 清除
      this.$refs.enterprform.resetFields();
      // 调用 搜索事件
      this.getEnterpriseForm();
    },
    // 改变状态点击事件 禁用和启用 发请求
    async changeStatus(id) {
      const res = await this.$axios({
        method: "post",
        url: "/enterprise/status",
        data: {
          id
        }
      });
      if (res.data.code == 200) {
        this.$message({
          message: "更改状态成功",
          type: "success"
        });
        // 要刷新 改完要刷新 调用搜索
        this.getEnterpriseForm();
      }
    },
    // 删除按钮的点击事件   发请求提示确认是否要删除 删除完刷新
    defaultEnterprise(id, name) {
      this.$confirm(`确定要删除${name}企业吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/enterprise/remove", { id });
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.searchEnterprise();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 改变每页显示几条数据 的函数
    handleSizeChange(val) {
      this.limit = val;
      this.getEnterpriseForm();
    },
    // 点击第几页  操作的函数
    handleCurrentChange(val) {
      this.page = val;
      this.getEnterpriseForm();
    },
    // 新添企业点击事件
    addEnterprise() {
      // 点击要清空里面的内容
      this.$refs.addAndupdata.addEmterpriseForm = {
        eid: "", //企业编号
        name: "", //企业名称
        short_name: "", //简称
        intro: "", //企业简介
        remark: "" //备注
      };
      this.$refs.addAndupdata.mode = "add";
      this.$refs.addAndupdata.dialogVisible = true;
      // 清除效验  写在了弹出框组件里面
      // this.$nextTick(() => {
      //   this.$refs.addAndupdata.$refs.EmterpriseForm.clearValidate();
      // });
    },
    // 编辑 点击事件
    updataEnterprise(obj) {
      // 显示点击的这个企业的数据 把这行数据传过来
      // console.log(obj);
      // this.$refs.addAndupdata.addEmterpriseForm = JSON.parse(
      //   JSON.stringify(obj)
      // );
      // 我这里传值后台不要那么多
      // 解构语法
      // console.log(obj);
      const { id, eid, intro, name, short_name, remark } = obj;
      this.$refs.addAndupdata.addEmterpriseForm = {
        id,
        eid,
        name,
        short_name,
        intro,
        remark
      };
      // 子组件 mode 改成不是add
      this.$refs.addAndupdata.mode = "updata";
      //  弹出 那个框
      this.$refs.addAndupdata.dialogVisible = true;
      // 清除效验
      // this.$nextTick(() => {
      //   this.$refs.addAndupdata.$refs.EmterpriseForm.clearValidate();
      // });
    }
  }
};
</script>

<style lang='less'>
.business {
  .header {
    height: 100%;
    .searchForm {
      .inputW {
        width: 150px;
      }
    }
  }
}
</style>