<template>
  <div class="question">
    <!-- 搜索内容区域 -->
    <el-card>
      <el-form inline :model="searchForm" ref="searchForm" label-width="50px">
        <el-row>
          <el-col :span="5">
            <el-form-item class="selectWidth" label="学科" prop="subject">
              <el-select v-model="searchForm.subject" placeholder="请选择学科">
                <el-option
                  v-for="item in subjectList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="阶段" prop="step">
              <el-select v-model="searchForm.step" placeholder="请选择阶段">
                <el-option
                  v-for="(value, name) in stepObj"
                  :key="name"
                  :label="value"
                  :value="name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="企业" prop="enterprise">
              <el-select v-model="searchForm.enterprise" placeholder="请选择企业">
                <el-option
                  v-for="item in enterpriseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="题型" prop="type">
              <el-select v-model="searchForm.type" placeholder="请选择题型">
                <el-option
                  v-for="(value, name) in typeObj"
                  :key="name"
                  :label="value"
                  :value="name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="searchForm.difficulty" placeholder="请选择难度">
                <el-option
                  v-for="(value, name) in difficultyObj"
                  :key="name"
                  :label="value"
                  :value="name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="作者" prop="username">
              <el-input style="width:208px;" v-model="searchForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="status">
              <el-select v-model="searchForm.status" placeholder="请选择状态">
                <el-option label="启用" value="1"></el-option>
                <el-option label="禁用" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="日期" prop="create_date">
              <el-date-picker v-model="searchForm.create_date" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input style="width:400px" v-model="searchForm.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" @click="seachlist">搜索</el-button>
              <el-button @click="clearForm">清除</el-button>
              <el-button type="primary" @click="addquestion">+新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 列表区域 -->
    <el-card style="margin-top:15px;">
      <el-table :data="questionList" border stripe>
        <el-table-column label="序号" type="index" width="50"></el-table-column>

        <el-table-column label="题目" width="200">
          <template slot-scope="scope">
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>

        <el-table-column label="学科.阶段" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.subject_name}}.{{stepObj[scope.row.step]}}</span>
          </template>
        </el-table-column>

        <el-table-column label="题型">
          <template slot-scope="scope">
            <span>{{typeObj[scope.row.type]}}</span>
          </template>
        </el-table-column>

        <el-table-column label="企业" prop="enterprise_name" />
        <el-table-column label="创建者" prop="username" />
        <el-table-column label="访问量" prop="reads" />

        <el-table-column label="状态">
          <template slot-scope="scope">
            <span
              :style="{ color: scope.row.status === 0 ? 'red' : '#6ac144' }"
            >{{scope.row.status==0?'禁用':'启用'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="280">
          <template slot-scope="scope">
            <el-button type="primary">编辑</el-button>
            <el-button
              @click="changebtn(scope.row.id)"
              :type="scope.row.status === 0 ? 'success' : 'info'"
            >{{scope.row.status==0?'启用':'禁用'}}</el-button>
            <el-button type="default" @click="delquestion(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <addAndUpquestion
      ref="addAndUpquestion"
      :subjectList="subjectList"
      :enterpriseList="enterpriseList"
      :stepObj="stepObj"
      :typeObj="typeObj"
      :difficultyObj="difficultyObj"
    ></addAndUpquestion>
  </div>
</template>

<script>
import addAndUpquestion from "../question/addandupdata";
export default {
  name: "Question",
  components: {
    addAndUpquestion
  },
  data() {
    return {
      subjectList: [], // 学科列表
      enterpriseList: [], // 企业列表
      stepObj: { 1: "初级", 2: "中级", 3: "高级" }, //阶段
      typeObj: { 1: "单选", 2: "多选", 3: "简答" }, //题型
      difficultyObj: { 1: "简单", 2: "一般", 3: "困难" }, //难度
      searchForm: {
        // 搜索的时候要传递给后台的
        subject: "", // 学科
        enterprise: "", // 企业
        step: "", // 阶段
        type: "", // 题型
        difficulty: "", // 难度
        username: "", // 作者
        status: "", // 状态 0 禁用 1 启用
        create_date: "", // 创建日期
        title: "" // 标题
      },
      page: 1, // 页码第一页
      limit: 2, // 页尺寸
      total: 0, // 总页数
      questionList: [] // 保存请求回来的 数据
    };
  },
  created() {
    // 获取所有的学科
    this.getSubjectListData();
    // 获取所有的企业
    this.getEnterpriseListData();
    // 进来就要拿到 数据
    this.getquestionlist();
  },
  methods: {
    // 获取所有的学科
    async getSubjectListData() {
      const res = await this.$axios.get("/subject/list");
      if (res.data.code === 200) {
        this.subjectList = res.data.data.items;
        // console.log(res.data.data.items);
      }
    },
    // 获取所有的企业
    async getEnterpriseListData() {
      const res = await this.$axios.get("/enterprise/list");
      if (res.data.code === 200) {
        this.enterpriseList = res.data.data.items;
      }
    },
    // 一进到这个页面就请求数据显示
    async getquestionlist() {
      const res = await this.$axios.get("/question/list", {
        params: {
          page: this.page,
          limit: this.limit,
          ...this.searchForm
        }
      });
      if (res.data.code == 200) {
        // console.log(res.data.data.items);
        this.questionList = res.data.data.items;
        this.total = res.data.data.pagination.total;
      }
    },
    // 搜索功能
    seachlist() {
      this.page = 1;
      this.getquestionlist();
    },
    // 清除按钮点击事件
    clearForm() {
      this.$refs.searchForm.resetFields();
      this.seachlist();
    },
    // 新增点击事件
    addquestion() {
      this.$refs.addAndUpquestion.mode = "add";
      this.$refs.addAndUpquestion.dialogVisible = true;
    },
    // 状态改变 点击事件
    async changebtn(id) {
      const res = await this.$axios.post("/question/status", { id });
      if (res.data.code == 200) {
        this.$message({
          type: "success",
          message: "更改状态成功!"
        });
        this.seachlist();
      }
    },
    // 删除  点击事件
    delquestion(id) {
      this.$confirm("确定要删除这道题目吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await this.$axios.post("/question/remove", { id });
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
    }
  }
};
</script>