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
            <!-- 点击编辑吧  把这一行的数据 传过来 显示 -->
            <el-button type="primary" @click="editSubject(scope.row)">编辑</el-button>
            <el-button
              @click="changebtn(scope.row.id)"
              :type="scope.row.status === 0 ? 'success' : 'info'"
            >{{scope.row.status==0?'启用':'禁用'}}</el-button>
            <el-button type="default" @click="delquestion(scope.row.id)">删除</el-button>
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
      mode: "",
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
    // 页容量发生了改变
    sizeChange(val) {
      this.limit = val;
      this.seachlist();
    },
    // 当前页发生了改变
    currentChange(val) {
      this.page = val;
      this.getEnterpriseListData();
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
    // 给mode 给成add  弹框弹出来
    // 清除  数据
    addquestion() {
      // 给mode 给成add
      this.$refs.addAndUpquestion.mode = "add";
      // 清除  数据  初始化数据
      this.$refs.addAndUpquestion.questionForms = {
        subject: "", // 学科
        step: "", // 阶段
        enterprise: "", // 企业
        city: [], // 城市
        type: "1", // 题型
        difficulty: "2", // 难度
        title: "", //  试题标题
        answer_analyze: "", // 试题答案
        remark: "", //  试题备注
        single_select_answer: "", //单选题答案
        multiple_select_answer: [], //多选题答案
        short_answer: "", // 简答题答案
        video: "", //视频地址
        select_options: [
          // 选项，介绍，图片介绍
          {
            label: "A",
            text: "狗不理",
            image: ""
          },
          {
            label: "B",
            text: "猫不理",
            image: ""
          },
          {
            label: "C",
            text: "麻花",
            image: ""
          },
          {
            label: "D",
            text: "炸酱面",
            image: ""
          }
        ]
      };
      //  弹框弹出来
      this.$refs.addAndUpquestion.dialogVisible = true;
    },
    //  编辑按钮    row 拿到点击的这一项的内容
    editSubject(row) {
      // 吧mode 改成 edit
      this.$refs.addAndUpquestion.mode = "edit";
      // 显示对应的内容   深克隆 显示对应的 数据
      this.$refs.addAndUpquestion.questionForms = JSON.parse(
        JSON.stringify(row)
      );
      // 发现 有问题   阶段  城市 单选  显示的不对 后台返回的数据 不和我们要求
      //   城市 后台返回的数据是个字符串   城市我们要转成数组
      // 阶段  难度  题型  我们要的是字符串 他返回的是数字 在组件里面改了
      //   城市
      if (row.city) {
        //  吧城市的字符串 改成数组
        this.$refs.addAndUpquestion.questionForms.city = row.city.split(",");
      } else {
        this.$refs.addAndUpquestion.questionForms.city = [];
      }
      // 多选答案 后台返回的也是个字符串  我们要转成数组 才能正常显示
      if (row.multiple_select_answer) {
        this.$refs.addAndUpquestion.questionForms.multiple_select_answer = row.multiple_select_answer.split(
          ","
        );
      } else {
        this.$refs.addAndUpquestion.questionForms.multiple_select_answer = [];
      }

      // 弹框弹出
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