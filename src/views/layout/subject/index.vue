<template>
  <div>
    <el-card>
      <el-form inline :model="subjectForm" ref="subjectForm" label-width="80px">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="subjectForm.rid" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input v-model="subjectForm.name" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="subjectForm.username" style="width:150px"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="subjectForm.status" placeholder style="width:150px">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
          <el-button @click="clearList">清除</el-button>
          <el-button type="primary" @click="addSubject">+新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="subjectList" stripe>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column label="学科编号" prop="rid"></el-table-column>
        <el-table-column label="学科名称" prop="name"></el-table-column>
        <el-table-column label="简称" prop="short_name"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="创建日期" prop="create_time" width="180"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{color:scope.row.status==0 ?'red':'green'}"
            >{{scope.row.status==0?'禁用':'启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary" @click="editSubject(scope.row)">编辑</el-button>
            <el-button
              @click="changeStatus( '/subject/status',scope.row.id)"
              :type="scope.row.status==0?'success':'info'"
            >{{scope.row.status==0?'启用':'禁用'}}</el-button>
            <el-button type="default" @click="defaultStatus(scope.row.id,scope.row.name)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:15px;text-align:center;">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          :current-page="page"
          :page-sizes="[2, 5, 10]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
        ></el-pagination>
      </div>
    </el-card>
    <add-and-updata ref="addAndUpdata"></add-and-updata>
  </div>
</template>
      

<script>
import addAndUpdata from "@/views/layout/subject/add-updata";
// 导入  混入的组件
import common from "@/mixins/common";
export default {
  mixins: [common],
  name: "subject",
  components: {
    addAndUpdata
  },
  data() {
    return {
      subjectForm: {
        name: "", //学科名称
        rid: "", //学科编号
        username: "", // 创建者用户名
        status: "" //  状态 0禁用 1 启用
      },
      page: 1, //当前页码
      limit: 2, // 显示几条数据
      subjectList: [],
      total: 0, //一共有几页
      mode: ""
    };
  },

  created() {
    this.getSubjectList();
  },
  methods: {
    async getSubjectList() {
      const res = await this.$axios.get("/subject/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.subjectForm
        }
      });
      // console.log(res);
      if (res.data.code == 200) {
        this.subjectList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 新增点击事件
    addSubject() {
      this.$refs.addAndUpdata.dialogVisible = true;
      this.$refs.addAndUpdata.mode = "add";
      this.$refs.addAndUpdata.subjectList = {
        rid: "", // 学科编号
        name: "", // 学科名称
        short_name: "", // 学科简称
        intro: "", // 学科简介
        remark: "" // 备注
      };
    },
    // 搜索的点击事件
    search() {
      // 改成第一页
      this.page = 1;
      // 发请求
      this.getSubjectList();
    },
    // 清除点击事件
    clearList() {
      this.$refs.subjectForm.resetFields();
      this.search();
    },
    // 编辑按钮
    editSubject(obj) {
      this.$refs.addAndUpdata.mode = "edit";
      const { id, rid, name, short_name, intro, remark } = obj;

      this.$refs.addAndUpdata.subjectlist = {
        id,
        rid,
        name,
        short_name,
        intro,
        remark
      };

      this.$refs.addAndUpdata.dialogVisible = true;
    },
    // 改变状态的点击事件  用混入 mixin
    // async changeStatus(id) {
    //   const res = await this.$axios.post("/subject/status", { id });
    //   if (res.data.code === 200) {
    //     this.$message({
    //       message: "更改状态成功",
    //       type: "success"
    //     });
    //     // 调用 seach方法
    //     this.search();
    //   }
    // },
    // 删除的点击事件
    defaultStatus(id, name) {
      this.$confirm(`确定要删除${name}吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = this.$axios.post("/subject/remove", { id });
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 一页显示几条数据 的事件
    sizeChange() {
      this.search();
    },
    // 当前第几页
    currentChange(val) {
      this.page = val;
      this.getSubjectList();
    }
  }
};
</script>

<style>
</style>