<template>
  <div class="questionEdit">
    <el-dialog title="提示" :visible.sync="dialogVisible" fullscreen>
      <div slot="title" class="title">{{mode=='add'?'新增题目':'编辑题目'}}</div>

      <el-form
        :model="questionForms"
        ref="questionForms"
        label-width="80px"
        class="form"
        :rules="rules"
      >
        <el-form-item label="学科" prop="subject">
          <el-select v-model="questionForms.subject" placeholder="请选择学科" class="selectWidth">
            <el-option
              v-for="item in subjectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="阶段" prop="step">
          <el-select v-model="questionForms.step" placeholder="请选择阶段" class="selectWidth">
            <!-- 这里  后台让我们传的是字符串 但是他返回的是 数字 我们这里吧他改成数字 才能正常显示 -->
            <el-option v-for="(value,name) in stepObj" :key="name" :label="value" :value="+name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="企业" prop="enterprise">
          <el-select v-model="questionForms.enterprise" placeholder="请选择企业" class="selectWidth">
            <el-option
              v-for="item in enterpriseList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="城市" prop="city">
          <el-cascader
            size="large"
            :options="options"
            :props="{value:'label'}"
            v-model="questionForms.city"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="题型" prop="type">
          <el-radio-group v-model="questionForms.type">
            <!-- 这里  后台让我们传的是字符串 但是他返回的是 数字 我们这里吧他改成数字 才能正常显示 -->
            <el-radio v-for="(value,name) in typeObj" :key="name" :label="+name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="难度" prop="difficulty">
          <el-radio-group v-model="questionForms.difficulty">
            <!-- 这里  后台让我们传的是字符串 但是他返回的是 数字 我们这里吧他改成数字 才能正常显示 -->
            <el-radio v-for="(value,name) in difficultyObj" :key="name" :label="+name">{{value}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="试题标题" prop="title" class="setMargin">
          <quill-editor :options="{placeholder:'请输入标题...'}" v-model="questionForms.title"></quill-editor>
        </el-form-item>
        <hr class="hrMargin" />
        <!-- 子组件  单选多选 -->
        <el-form-item
          :label="typeObj[questionForms.type]"
          :prop="questionTypeValidateObj[questionForms.type]"
        >
          <question-type :questionForms="questionForms"></question-type>
        </el-form-item>
        <!-- 视频的子组件 -->
        <hr class="hrMargin" />
        <el-form-item label="解析视频">
          <!-- 给他绑定 v-model  v-model 是  :value 和 @input 的语法糖 
           通过子父 传值  这样实现双向的绑定
          -->
          <upload-file type="video" v-model="questionForms.video"></upload-file>
        </el-form-item>

        <el-form-item label="答案解析" prop="answer_analyze" class="setMargin">
          <quillEditor :options="{placeholder:'请输入答案解析...'}" v-model="questionForms.answer_analyze"></quillEditor>
        </el-form-item>

        <hr class="hrMargin" />

        <el-form-item label="试题备注" prop="remark">
          <el-input v-model="questionForms.remark"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button>取消</el-button>
          <el-button type="primary" @click="onSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// 导入富文本的css
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// 导入富文本编辑器
import { quillEditor } from "vue-quill-editor";
// 打入中国 省市
import { regionData } from "element-china-area-data";
// 导入子组件
import QuestionType from "../question/question-type";
// 导入视频那个子组件
import UploadFile from "./upload-file";
export default {
  name: "qiyeadd",
  // 注册 富文本编辑器
  components: {
    quillEditor,
    // 注册子组件
    QuestionType,
    // 注册视频子组件
    UploadFile
  },
  props: {
    subjectList: Array, // 学科列表
    enterpriseList: Array, // 企业列表
    stepObj: Object, //阶段
    typeObj: Object, //题型
    difficultyObj: Object //难度
  },
  data() {
    return {
      // 想去校验 多选单选 的话 不能写死 上面prop 绑定这个对象 根据type 改变效验
      questionTypeValidateObj: {
        1: "single_select_answer", // 单选
        2: "multiple_select_answer", // 多选
        3: "short_answer" // 简答
      },
      options: regionData,
      dialogVisible: false,
      mode: "",
      questionForms: {
        subject: "", // 学科
        step: "", // 阶段
        enterprise: "", // 企业
        city: [], // 城市
        type: "", // 题型
        difficulty: "", // 难度
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
      },
      rules: {
        subject: [{ required: true, message: "请选择学科", trigger: "change" }],
        step: [{ required: true, message: "请选择阶段", trigger: "change" }],
        enterprise: [
          { required: true, message: "请选择企业", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        type: [{ required: true, message: "请选择题型", trigger: "change" }],
        difficulty: [
          { required: true, message: "请选择难度", trigger: "change" }
        ],
        title: [{ required: true, message: "标题不能为空", trigger: "change" }],
        answer_analyze: [
          { required: true, message: "答案解析不能为空", trigger: "change" }
        ],
        remark: [
          { required: true, message: "答案备注不能为空", trigger: "blur" }
        ],
        single_select_answer: [
          { required: true, message: "单选答案不能为空", trigger: "blur" }
        ],
        multiple_select_answer: [
          { required: true, message: "多选答案不能为空", trigger: "blur" }
        ],
        short_answer: [
          { required: true, message: "简答答案不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 点击确认 校验是否填写 复合规则  发请求
    //   判断是  新增还是 编辑
    onSubmit() {
      this.$refs.questionForms.validate(async valid => {
        if (!valid) return; //  这里是false 说明效验不过
        //  这里就是效验通过
        // 发请求  判断是编辑的还是 新增的
        let res = null;
        if (this.mode == "add") {
          res = await this.$axios.post("/question/add", this.questionForms);
        } else {
          //
          this.questionForm.city = this.questionForm.city.join(",");
          res = await this.$axios.post("/question/edit", this.questionForms);
        }

        if (res.data.code === 200) {
          // 提示
          this.$message({
            type: "success",
            message: this.mode === "add" ? "新增成功~" : "编辑成功~"
          });
          // 关闭当前对话框
          this.dialogVisible = false;
          // 调用父组件的seachlist
          this.$parent.seachlist();
        }
      });
    }
  }
};
</script>

<style lang="less">
.questionEdit {
  .title {
    color: #fff;
    padding-left: 15px;
    height: 54px;
    line-height: 54px;
    background-color: #04bcfa;
  }
  .el-dialog__header {
    padding: 0px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
  }
  .form {
    width: 832px;
    margin: 0 auto;
  }
  .selectWidth {
    width: 300px;
  }
  .setMargin {
    .el-form-item__content {
      margin-left: 0px !important;
      margin-top: 40px;
    }
  }
  .ql-editor {
    height: 100px;
  }
  .hrMargin {
    margin-bottom: 20px;
  }
}
</style>